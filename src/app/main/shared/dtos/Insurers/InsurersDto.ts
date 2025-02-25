export interface InsurersDtoResponse
{
    data: InsurersDto[]
    totalRowsCount: number
}

export interface InsurersDto
{
    rowNo: number
    insCode: number
    insName: string
    isDeleted: boolean
}
