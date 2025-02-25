export interface CompanyInfoDtoResponse
{
    data: CompanyInfoDto[]
    totalRowsCount: number
}

export interface CompanyInfoDto
{
    id: number
    name: string
    address: string
    state: string
    pCode: string
    city: string
    country: string
    phone: string
    fax: string
    email: string
    image: any
    imageBase64: any
    imgStorageLoc: string
}
