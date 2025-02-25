export interface BarCodeStructureDtoResponse
{
    data: BarCodeStructureDto[]
    totalRowsCount: number
}

export interface BarCodeStructureDto
{
    rowNo: number
    barStructID: number
    barStructDesc: string
    barStructLength: number
    barStructPrefix: string
    valueSep: string
    barCode: string
    isDeleted: boolean
}
