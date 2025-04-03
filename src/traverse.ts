import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { addOrUpdateComponent } from "./helpers/componentHelper";
import { ProgramOutput, SourceTypes } from "./types";
import { EXCLUDED_COMPONENTS } from "./helpers/excludedComponents";
import { PluginPass } from "@babel/core";
import defaultPath from "path";
import { collectPropertyChain, findParentComponent, getBindingSourceType, getComponentName, removeComponentFunction } from "./helpers/traverseHelpers";

/**
 * Analyzes the props used in the provided AST.
 * @param {t.JSXOpeningElement} path - The parsed AST.
 * @param {PluginPass} state - The state.
 * @param {ProgramOutput} output - The final program output.
 * @returns {ProgramOutput} - An array of tuples where each tuple contains a component name and an array of property names.
 */
export function getUsedProps(
    path: NodePath<t.JSXOpeningElement>, 
    state: PluginPass,
    output: ProgramOutput
): ProgramOutput {
    const projectRoot = defaultPath.resolve(process.cwd(), "src"); 
    const fileName = defaultPath.relative(projectRoot, state.file.opts.filename);

    const componentPath = findParentComponent(path);
    if (!componentPath) return output;

    const componentName = getComponentName(componentPath);
    if (!componentName) return output;

    output = removeComponentFunction(output, fileName, componentName);

    const usedProps: { nameParts: string[]; sourceType: SourceTypes }[] = [];

    const collectUsedVariables = (path: NodePath<t.Node>, sourceType: SourceTypes ) => {
        if (path.isIdentifier()) {
            usedProps.push({ nameParts: [path.node.name], sourceType });
        }
    };

    componentPath.traverse({
        MemberExpression(path: NodePath<t.MemberExpression>) {
            if (path.node.property && !path.parentPath.isMemberExpression() && componentName) {
                if (path.parent.type === "CallExpression" && path.node === path.parent.callee) return;

                const { nameParts, currentPath } = collectPropertyChain(path);

                if (currentPath.isIdentifier()) {
                    nameParts.unshift(currentPath.node.name);
                    const fullName = nameParts.join(".");

                    if (!EXCLUDED_COMPONENTS.has(fullName)) {
                        usedProps.push({ nameParts, sourceType: getBindingSourceType(currentPath as NodePath<t.Identifier>) });
                    }
                }
            }
        },

        Identifier(path: NodePath<t.Identifier>) {
            if (path.parentPath.isJSXExpressionContainer() && componentName) {
                usedProps.push({ nameParts: [path.node.name], sourceType: getBindingSourceType(path) });
            }

            if (
                path.node.name === "props" &&
                path.parentPath.isMemberExpression() &&
                path.parentPath.get("object").isThisExpression()
            ) {
                let currentPath = path.parentPath;
                while (currentPath.parentPath.isMemberExpression()) {
                    currentPath = currentPath.parentPath;
                }

                if (!currentPath.parentPath.isMemberExpression()) {
                    const { nameParts } = collectPropertyChain(currentPath);

                    if (nameParts[0] === "props") {
                        nameParts.shift();
                    }

                    usedProps.push({ nameParts, sourceType: "function_param" });
                }
            }
        },

        CallExpression(path: NodePath<t.CallExpression>) {
            const callee = path.node.callee;

            if (
                callee.type === "Identifier" &&
                (callee.name === "useMemo" || callee.name === "useState")
            ) {
                const hookArgs = path.node.arguments;
                if (hookArgs.length > 0) {
                    const dependencies = hookArgs[1];
                    if (dependencies && t.isArrayExpression(dependencies)) {
                        dependencies.elements.forEach((dep) => {
                            if (t.isIdentifier(dep)) {
                                usedProps.push({ nameParts: [dep.name], sourceType: "local_variable" });
                            }
                        });
                    }
                }
            }

            if (callee.type === "Identifier") {
                usedProps.push({ nameParts: [callee.name], sourceType: "function_call" });
            }
        },

        FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
            if (path.node.id) {
                usedProps.push({ nameParts: [path.node.id.name], sourceType: "local_variable" });
            }
            path.traverse({
                Identifier(innerPath: NodePath<t.Identifier>) {
                    collectUsedVariables(innerPath, getBindingSourceType(innerPath));
                },
            });
        },

        FunctionExpression(path: NodePath<t.FunctionExpression>) {
            if (path.node.id) {
                usedProps.push({ nameParts: [path.node.id.name], sourceType: "local_variable" });
            }
            path.traverse({
                Identifier(innerPath: NodePath<t.Identifier>) {
                    collectUsedVariables(innerPath, getBindingSourceType(innerPath));
                },
            });
        },

        ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
            path.traverse({
                Identifier(innerPath: NodePath<t.Identifier>) {
                    collectUsedVariables(innerPath, getBindingSourceType(innerPath));
                },
            });
        },

    });

    addOrUpdateComponent(output, fileName, componentName, usedProps);

    return output;
}


