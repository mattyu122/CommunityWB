import { HandBill } from "../../models/HandBill"

export interface GetHandBillPageDto {
    handBills: HandBill[]
    totalPages: number
    totalElements: number
    currentPage: number
}