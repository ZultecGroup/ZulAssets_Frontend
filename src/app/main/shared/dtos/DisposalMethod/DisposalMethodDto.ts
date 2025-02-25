export interface DisposalMethodDtoResponse
{
    data: DisposalMethodDto[]
    totalRowsCount: number
}

export interface DisposalMethodDto
{
    rowNo: number
    dispCode: number
    dispDesc: string
    isDeleted: boolean
}
