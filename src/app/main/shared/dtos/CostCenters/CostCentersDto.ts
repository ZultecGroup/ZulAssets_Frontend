export interface CostCentersDtoResponse
{
    data: CostCentersDto[]
    totalRowsCount: number
}

export interface CostCentersDto
{
    rowNo: number
    costID: string
    costNumber: string
    costName: string
    isDeleted: boolean
    companyId: number
}
