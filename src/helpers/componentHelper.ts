import { ProgramOutput, UsedProp } from "../types";

/**
 * Helper function to update or add a component in the output.
 * @param {ProgramOutput} output - The current output array.
 * @param {string} filePath - The current file being analyzed.
 * @param {string} componentName - The name of the component or prop to add.
 * @param {UsedProp[]} usedProps - The used props to be added.
 */
export function addOrUpdateComponent(
    output: ProgramOutput, 
    filePath: string, 
    componentName: string, 
    usedProps: UsedProp[]
) {
    const existingFile = output.find(x => x.fileName === filePath);

    const uniqueUsedProps = usedProps.filter((prop, index, self) =>
        index === self.findIndex(p =>
            p.nameParts.join('.') === prop.nameParts.join('.') &&
            p.sourceType === prop.sourceType
        )
    );

    if (existingFile) {
        const existingComponent = existingFile.functions.find(x => x.name === componentName);
                
        if (existingComponent) {
            uniqueUsedProps.forEach(({ nameParts, sourceType }) => {
                if (!existingComponent.used.some(
                    x => x.nameParts.join('.') === nameParts.join('.') && x.sourceType === sourceType
                )) {
                    existingComponent.used.push({ nameParts, sourceType });
                }
            });
        } else {
            existingFile.functions.push({
                name: componentName,
                used: uniqueUsedProps,
            });
        }
    } else {
        output.push({
            fileName: filePath,
            functions: [{
                name: componentName,
                used: uniqueUsedProps,
            }]
        });
    }
}
