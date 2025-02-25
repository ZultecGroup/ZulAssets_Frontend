export interface OrgLevelsDtoResponse
{
    data: OrganizationLevelsDto[]
    totalRowsCount: number
}

export interface OrganizationLevelsDto
{
    rowNo: number
    lvlID: number
    lvlDesc: string
    isdeleted: boolean
}