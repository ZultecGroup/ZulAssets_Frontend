export interface GLCodesDtoResponse
{
    data: GLCodesDto[]
    totalRowsCount: number
}

export interface GLCodesDto
{
    rowNo: number
    glCode: number
    glDesc: string
    companyId: any
    companyName: any
}
