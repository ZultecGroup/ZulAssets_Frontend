export interface AssetBooksDtoResponse
{
    data: AssetBooksDto[]
    totalRowsCount: number
}

export interface AssetBooksDto
{
    rowNo: number
    bookID: number
    depCode: number
    isDeleted: boolean
    description: string
    isDefault: any
    companyID: number
    companyName: any
    depDesc: string
}
