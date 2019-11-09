export interface StepExport {
    title: string
    description: string
    note?: string
    nextSteps: Array<{ title: string, note?: string }>
    snippet?: {
        content: string
        language: string
    }
}