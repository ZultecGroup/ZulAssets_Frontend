export interface SuppliersDtoResponse
{
    data: SuppliersDto[]
    totalRowsCount: number
}

export interface SuppliersDto
{
    rowNo: number
    suppID: string
    suppName: string
    suppCell: string
    suppFax: string
    suppPhone: string
    suppEmail: string
    isDeleted: boolean
}
