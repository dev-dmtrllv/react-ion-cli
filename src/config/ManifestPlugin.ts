import { Compiler } from "webpack";

const fs = require("fs");
const path = require("path");

export class ManifestPlugin
{
	private readonly file: string;
	private readonly base: string;
	
	constructor(file = "manifest.json", base: string = "/")
	{
		this.file = file;
		this.base = base === "/" ? "" : base;
	}

	transformPath = (p: string, ctx: string, prepend: boolean = false) => 
	{
		let newPath = p.replaceAll("\\", "/").replace(ctx, "");
		if (prepend)
		{
			if (!newPath.startsWith("/"))
				return `${this.base}/${newPath}`;
		}
		else
		{
			if (newPath.startsWith("/"))
				return `${newPath.substring(1)}`;
		}
		return `${newPath}`;
	}

	apply(compiler: Compiler)
	{
		compiler.hooks.done.tapAsync(ManifestPlugin.name, ({ compilation }, done) => 
		{
			const manifestPath = path.resolve(compiler.outputPath, this.file);
			const root = compiler.context.replaceAll("\\", "/");
			const manifest: any = {
				main: {},
				chunks: {}
			};

			for (const { files, name } of compilation.chunks)
			{
				if (name)
				{
					manifest.main[name === "main" ? "app" : name] = Array.from(files).map(p => this.transformPath(p, root, true));
				}
			}

			for (const { chunks, origins } of compilation.chunkGroups)
			{
				const origin = origins && origins[0];
				if (origin)
				{
					let fileName = origin.request;

					if (fileName)
					{
						if (origin.module?.context)
							fileName = path.join(origin.module.context, fileName);


						fileName = this.transformPath(fileName, root, false);

						manifest.chunks[fileName] = {};

						for (const { files } of chunks)
						{
							manifest.chunks[fileName] = Array.from(files).map(p => this.transformPath(p, root, true));
						}
					}
				}
			}
			if (!fs.existsSync(path.dirname(manifestPath)))
				fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
			fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4), "utf-8");
			done();
		});
	}
}
