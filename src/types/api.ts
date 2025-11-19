export interface ImportError {
    line: number
    column: string
    error: string
    value: string
}

export interface ImportResult {
    success: boolean
    totalRows: number
    importedRows: number
    errors?: ImportError[]
}