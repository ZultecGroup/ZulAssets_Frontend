export interface BarCodePolicyDtoResponse
{
    data: BarCodePolicyDto[]
    totalRowsCount: number
}

export interface BarCodePolicyDto
{
    companyId: number
    companyCode: string
    companyName: string
    barStructID: string
}
