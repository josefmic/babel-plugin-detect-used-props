import { ProgramOutput, UsedProp } from "../types";

/**
 * Helper function to update or add a component in the output.
 * @param {ProgramOutput} output - The current output array.
 * @param {string} filePath - The current file being analyzed.
 * @param {string} componentName - The name of the component or prop to add.
 * @param {string[][]} nameParts - The parts of the name to add to `used`.
 */
export function addOrUpdateComponent(
    output: ProgramOutput, 
    filePath: string, 
    componentName: string, 
    usedProps: UsedProp[]
) {
    const existingFile = output.find(x => x.fileName === filePath);

    if (existingFile) {
        const existingComponent = existingFile.functions.find(x => x.name === componentName);
                
        if (existingComponent) {
            usedProps.forEach(({ nameParts, sourceType }) => {
                if (!existingComponent.used.some(x => x.nameParts.join('.') === nameParts.join('.'))) {
                    existingComponent.used.push({ nameParts, sourceType });
                }
            });
        } else {
            existingFile.functions.push({
                name: componentName,
                used: usedProps,
            });
        }
    } else {
        output.push({
            fileName: filePath,
            functions: [{
                name: componentName,
                used: usedProps,
            }]
        });
    }
}
