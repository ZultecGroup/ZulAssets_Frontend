export interface DisposalOrSaleDtoResponse
{
    totalRowsCount: number
    data: DisposalOrSaleDto[]
}

export interface DisposalOrSaleDto
{
    rowNo: number
    dispCode: number
    dispDesc: string
    isDeleted: boolean
}
