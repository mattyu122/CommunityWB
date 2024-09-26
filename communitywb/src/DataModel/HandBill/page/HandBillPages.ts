import HandBill from "../Handbill";

class HandBillPage {
    handBills: HandBill[]
    totalPages: number
    totalElements: number
    currentPage: number
    constructor(handBills = [], totalPages = 0, totalElements = 0, currentPage = 0) {
      this.handBills = handBills;
      this.totalPages = totalPages;
      this.totalElements = totalElements;
      this.currentPage = currentPage;
    }
}

export default HandBillPage;