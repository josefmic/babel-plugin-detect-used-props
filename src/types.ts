declare global {
    const ANALYZED_PROPS: ProgramOutput;
}

export type UsedProp = {
    nameParts: string[];
    sourceType: "local_variable" | "function_param" | "imported" | "global";
}

export type AnalyzedFile = {
    fileName: string,
    functions: {
        name: string,
        used: UsedProp[],
    }[]    
}

export type ProgramOutput = AnalyzedFile[];

export type AnalyzePropsOptions = {
    filePath?: string;
    patterns?: string | string[];
}