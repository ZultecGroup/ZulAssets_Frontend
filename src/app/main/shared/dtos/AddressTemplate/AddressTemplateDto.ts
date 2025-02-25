export interface AddressTemplateDtoResponse
{
    data: AddressTemplateDto[]
    totalRowsCount: number
}

export interface AddressTemplateDto
{
    rowNo: number
    addressID: number
    addressDesc: string
    isDeleted: boolean
}