export interface DataProcessingDtoResponse
{
    totalRowsCount: number
    data: DataProcessingDto[]
}

export interface DataProcessingDto
{
    astID: string
    astDesc: string
    deviceID: number
    deviceDesc: string
    locID: string
    toLoc: string
    currentLocation: string
    fromLoc: string
    previousLocation: string
    astCatID: string
    catFullPath: string
    status: number
    pieces: number
    serailNo: string
    custodianID: string
    inventoryDate: string
    isDataChanged: boolean
    astTransID: string
    remarks: string
    assetStatus: any
    barCode: string
}
