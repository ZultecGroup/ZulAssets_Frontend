export interface InventoryScheduleDtoResponse
{
    data: InventoryScheduleDto[]
    totalRowsCount: number
}

export interface InventoryScheduleDto
{
    rowNo: number
    invSchCode: number
    invDesc: string
    invStartDate: string
    invEndDate: string
    isDeleted: boolean
    closed: boolean
    schType: number
    invLoc?: string
    invDev: any
}
