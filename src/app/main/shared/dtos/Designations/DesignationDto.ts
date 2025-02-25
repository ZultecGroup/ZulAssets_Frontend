export interface DesignationDtoResposne
{
    data: DesignationDto[]
    totalRowsCount: number
}

export interface DesignationDto
{
    rowNo: number
    designationID: number
    description: string
    isDeleted: boolean
}
