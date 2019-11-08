export interface ActionExport {
    id: string
    type: string
    title: string
    description: string
    note?: string
    edges: Array<{ targetId: string, targetTitle: string, note?: string }>
    snippet?: {
        content: string
        language: string
    }
}