import { HandBill } from "../../models/HandBill"

export interface GetHandBillPageDto {
    handBills: HandBill[]
    totalPages: number
    pageSize: number
    totalElements: number
    currentPage: number
}