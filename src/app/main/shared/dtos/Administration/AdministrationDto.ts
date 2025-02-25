export interface AdministrationDtoResponse
{
    totalRowsCount: TotalRowsCount[]
    data: AdministrationDto[]
}

export interface TotalRowsCount
{
    totalRowsCount: number
}

export interface AdministrationDto
{
    "asset#": number
    assetDescription: string
    custodianName: string
    astBrandName: string
    companyName: string
    barCode: string
    "serial#": string
    fullCategory: string
    locationFullPath: string
    costNumber: string
    costName: string
    warranty: number
    status: string
    disposalComments: string
    labelCount: number
}
