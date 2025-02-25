export interface AssetItemsDtoResponse
{
    data: AssetItemsDto[]
    totalRowsCount: number
}

export interface AssetItemsDto
{
    rowNo: number
    itemCode: string
    astCatID: string
    astDesc: string
    astModel: string
    astQty: number
    warranty: number
    imageBase64: any
    catFullPath: string
    imageStorageLoc: string
}
