import * as ts from "typescript";
import * as path from "path";

const factory = ts.factory;
const otherOp = path.sep === "/" ? "\\" : "/";

export const transformImports = (projectPath: string) => (context: any) =>
{
	const visitor = (node: any) =>
	{
		let fn = (node.getSourceFile().fileName || "./src").replaceAll(otherOp, path.sep).replace(projectPath, ".");

		if (ts.isCallExpression(node) && node.expression.kind === 102)
		{
			return factory.createCallExpression(
				factory.createPropertyAccessExpression(
					factory.createCallExpression(
						factory.createToken(ts.SyntaxKind.ImportKeyword) as any,
						undefined,
						node.arguments
					),
					factory.createIdentifier("then")
				),
				undefined,
				[factory.createArrowFunction(
					undefined,
					undefined,
					[factory.createParameterDeclaration(
						undefined,
						undefined,
						factory.createIdentifier("mod"),
						undefined,
						undefined,
						undefined
					)],
					undefined,
					factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
					factory.createBlock(
						[
							factory.createExpressionStatement(factory.createBinaryExpression(
								factory.createPropertyAccessExpression(
									factory.createIdentifier("mod"),
									factory.createIdentifier("__path__")
								),
								factory.createToken(ts.SyntaxKind.EqualsToken),
								factory.createStringLiteral(fn)
							)),
							factory.createExpressionStatement(factory.createBinaryExpression(
								factory.createPropertyAccessExpression(
									factory.createIdentifier("mod"),
									factory.createIdentifier("__import__")
								),
								factory.createToken(ts.SyntaxKind.EqualsToken),
								node.arguments.at(0) as any
							)),
							factory.createReturnStatement(factory.createIdentifier("mod"))
						],
						true
					)
				)]
			);
		}
		return ts.visitEachChild(node, visitor, context);
	};

	return (sf: any) => ts.visitNode(sf, visitor);
}
