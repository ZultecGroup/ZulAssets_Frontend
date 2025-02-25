export interface DepMethodDtoResponse
{
    data: DepreciationMethodDto[]
    totalRowsCount: number
}

export interface DepreciationMethodDto
{
    rowNo: number
    depCode: number
    depDesc: string
    isDeleted: boolean
}
