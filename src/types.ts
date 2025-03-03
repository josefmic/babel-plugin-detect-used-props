export type PropPath = string[]

declare global {
    const ANALYZED_PROPS: ProgramOutput;
}

export type AnalyzedFile = {
    fileName: string,
    functions: Array<{
        name: string,
        used: PropPath[],
        unused?: PropPath[],
    }>    
}

export type ProgramOutput = AnalyzedFile[];

export type AnalyzePropsOptions = {
    filePath?: string;
}