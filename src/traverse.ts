import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { addOrUpdateComponent } from "./helpers/componentHelper";
import { ProgramOutput } from "./types";
import { EXCLUDED_COMPONENTS } from "./helpers/excludedComponents";
import { PluginPass } from "@babel/core";
import defaultPath from "path";

function findParentComponent(path: NodePath<t.JSXOpeningElement>) {
    return path.findParent((p) =>
        p.isFunctionDeclaration() ||
        p.isFunctionExpression() ||
        p.isArrowFunctionExpression() ||
        p.isClassDeclaration()
    );
}

function getComponentName(componentPath: NodePath): string | null {
    if (componentPath.isFunctionDeclaration() || componentPath.isClassDeclaration()) {
        return componentPath.node.id?.name || null;
    } else if (componentPath.isFunctionExpression() || componentPath.isArrowFunctionExpression()) {
        const parent = componentPath.findParent((p) => p.isVariableDeclarator());
        if (parent?.isVariableDeclarator() && t.isIdentifier(parent.node.id)) {
            return parent.node.id.name;
        }
    }
    return null;
}

function removeComponentFunction(output, fileName, componentName) {
    return output.map(o => {
        if (defaultPath.normalize(o.fileName) !== fileName) return o;

        return {
            ...o,
            functions: o.functions.filter(f => f.name !== componentName),
        };
    }).filter(o => o.functions.length > 0);
}


/**
 * Analyzes the props used in the provided AST.
 * @param {t.JSXOpeningElement} path - The parsed AST.
 * @param {AnalyzedFunctions} output - The final program output.
 * @returns {ProgramOutput} - An array of tuples where each tuple contains a component name and an array of property names.
 */
export function getUsedProps(
    path: NodePath<t.JSXOpeningElement>, 
    state: PluginPass,
    output: ProgramOutput
): ProgramOutput {
    const fileName = state.file.opts.filename;

    const componentPath = findParentComponent(path);
    if (!componentPath) return output;

    const componentName = getComponentName(componentPath);
    if (!componentName) return output;

    output = removeComponentFunction(output, fileName, componentName);

    componentPath.traverse({
        MemberExpression(path: NodePath<t.MemberExpression>) {
            if (path.node.property && !path.parentPath.isMemberExpression() && componentName) {
                if (path.parent.type === "CallExpression" && path.node === path.parent.callee) return;

                let currentPath: NodePath = path;
                const nameParts: string[] = [];

                while (currentPath.isMemberExpression()) {
                    const property = currentPath.node.property;
                    if (t.isIdentifier(property)) {
                        nameParts.unshift(property.name);
                    } else if (t.isStringLiteral(property)) {
                        nameParts.unshift(property.value);
                    } else if (t.isPrivateName(property)) {
                        nameParts.unshift("PrivateName");
                    }
                    currentPath = currentPath.get("object") as NodePath;
                }

                if (currentPath.isIdentifier()) {
                    nameParts.unshift(currentPath.node.name);
                    const fullName = nameParts.join(".");
                    if (!EXCLUDED_COMPONENTS.has(fullName)) {
                        addOrUpdateComponent(output, fileName, componentName, [nameParts]);
                    }
                }
            }
        },
        Identifier(path: NodePath<t.Identifier>) {
            if (path.parentPath.isJSXExpressionContainer() && componentName) {
                const propName = path.node.name;
                addOrUpdateComponent(output, fileName, componentName, [[propName]]);
            }
        },
    });

    return output;
}
