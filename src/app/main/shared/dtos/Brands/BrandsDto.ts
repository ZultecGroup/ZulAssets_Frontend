export interface BrandsDtoResponse
{
    data: BrandsDto[]
    totalRowsCount: number
}

export interface BrandsDto
{
    rowNo: number
    astBrandID: number
    astBrandName: string
    isDeleted: boolean
}
