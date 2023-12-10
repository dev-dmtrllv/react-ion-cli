import path from "path";
import { createGenerator } from "../Generator";

export const createPageApiEntryPath = () => path.resolve(__dirname, "../../../../.entries/client/api.ts");

export const pageApiEntry = createGenerator(createPageApiEntryPath(), () => 
{
	return `// @ts-ignore
const { paths, base } = window.__SSR_DATA__.apiInfo;
// @ts-ignore
const api = window.api = {};
paths.forEach((p: string) => 
{
	const parts = p.replace(base, "").split("/").filter(s => !!s);
	
	let target: any = api;
	parts.forEach((p: any) => 
	{
		if (!target[p])
			target[p] = {};
		target = target[p];
	});

	["get", "post", "put", "delete"].forEach((m) => 
	{
		target[m] = Object.assign((data = {}) => fetch(p + (m === "get" ? \`?\${new URLSearchParams(data).toString()}\` : ""), {
			method: m.toUpperCase(),
			body: m === "get" ? null : JSON.stringify(data),
			headers: m === "get" ? {} : {
				"Content-Type": "application/json"
			}
		}).then(res => res.json()).catch(e => ({ error: e })), {
			url: p,
			method: m
		}); 
	});
});`;
});
