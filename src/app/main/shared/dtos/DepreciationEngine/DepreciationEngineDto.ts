export interface DepreciationEngineDtoResponse
{
    data: DepreciationEngineDto[]
    totalRowsCount: number
}

export interface DepreciationEngineDto
{
    bookID: number
    description: string
    depDesc: string
    depCode: number
    companyID: number
    companyName: string
}
