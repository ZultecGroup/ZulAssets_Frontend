export interface PurchaseOrderDtoResponse
{
    data: PurchaseOrderDto[],
    totalRowsCount: number
}

export interface PurchaseOrderDto
{
    rowNo: number
    poItmID: number
    itemCode: string
    itemCost: number
    addCharges: number
    itemQuantity: number
    unitDesc: string
    totalCost: number
}
