export interface ApprovedOrderDtoResponse
{ 
    data: ApprovedOrderDto[],
    totalRowsCount: number
}

export interface ApprovedOrderDto
{
    poCode: number
    poDate: string
    amount: number
    addCharges: number
    approvedby: string
    transferStatus: string
}
