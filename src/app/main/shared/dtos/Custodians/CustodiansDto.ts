export interface CustodiansDtoResponse
{
    totalRowsCount: number
    data: CustodiansDto[]
}

export interface CustodiansDto
{
    rowNo: number
    custodianID: string
    custodianName: string
    custodianCode: string
    custodianPhone: string
    custodianEmail: string
    custodianFax: string
    custodianCell: string
    custodianAddress: string
    orgHierName: string
    orgHierID: number
    designation: string
    designationID: number
}
