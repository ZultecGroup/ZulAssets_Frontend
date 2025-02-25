export interface AstCodingDefDtoResponse
{
    data: AstCodingDefinitionDto[]
    totalRowsCount: number
}

export interface AstCodingDefinitionDto
{
    rowNo: number
    assetCodingID: number
    startSerial: number
    endSerial: number
    status: string
    companyId: number
    companyName: string
}
