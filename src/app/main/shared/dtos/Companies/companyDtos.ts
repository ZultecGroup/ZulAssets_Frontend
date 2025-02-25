export interface CompanyDtoResponse
{
    data: CompanyDto[];
    totalRowsCount: number;
}

export interface CompanyDto
{
    rowNo: number;
    companyId: number;
    companyCode: string;
    companyName: string;
    barStructDesc: string;
    barCode: string;
}

