export interface PoApprovalsDtoResponse
{
    data: PoApprovalsDto[]
    totalRowsCount: number
}

export interface PoApprovalsDto
{
    poCode: number
    transferStatus: string
    preparedby: string
    approvedby: string
    addCharges: number
    amount: number
    poDate: string
}