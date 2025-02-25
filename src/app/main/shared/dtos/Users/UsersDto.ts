export interface UsersDtoResponse
{
    totalRowsCount: number
    data: UsersDto[]
}

export interface UsersDto
{
    rowNo: number
    loginName: string
    userName: string
    userAccess: number
    role: string
    emailAddress: any
}
