export interface RolesDtoResponse
{
    data: RolesDto[]
    totalRowsCount: number
}

export interface RolesDto
{
    rowNo: number
    roleID: number
    description: string
}