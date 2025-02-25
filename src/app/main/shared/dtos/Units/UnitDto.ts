export interface UnitDtoResponse
{
    data: UnitDto[]
    totalRowsCount: number
}

export interface UnitDto
{
    rowNo: number
    unitID: number
    unitDesc: string
    isDeleted: boolean
}
