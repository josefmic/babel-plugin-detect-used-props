import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import defaultPath from "path";
import { SourceTypes } from "../types";

export function findParentComponent(path: NodePath<t.JSXOpeningElement>) {
    return path.findParent((p) =>
        p.isFunctionDeclaration() ||
        p.isFunctionExpression() ||
        p.isArrowFunctionExpression() ||
        p.isClassDeclaration()
    );
}

export function getComponentName(componentPath: NodePath): string | null {
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

export function removeComponentFunction(output, fileName, componentName) {
    return output.map(o => {
        if (defaultPath.normalize(o.fileName) !== fileName) return o;

        return {
            ...o,
            functions: o.functions.filter(f => f.name !== componentName),
        };
    }).filter(o => o.functions.length > 0);
}

export function getBindingSourceType(path: NodePath<t.Identifier>): SourceTypes {
    const binding = path.scope.getBinding(path.node.name);

    if (binding) {
        if (binding.kind === "param") {
            return "function_param";
        } else if (binding.kind === "module") {
            return "imported";
        } else if (binding.kind === "var" || binding.kind === "let" || binding.kind === "const") {
            return "local_variable";
        }
    }

    return "global";
}

export function collectPropertyChain(path: NodePath): { nameParts: string[]; currentPath: NodePath } {
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
    
    return { nameParts, currentPath };
}