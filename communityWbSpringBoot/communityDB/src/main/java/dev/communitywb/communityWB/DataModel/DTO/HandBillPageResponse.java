package dev.communitywb.communityWB.DataModel.DTO;

import java.util.List;

import dev.communitywb.communityWB.DataModel.HandBill;

public class HandBillPageResponse {
    private List<HandBill> handBills;
    private int totalPages;
    private long totalElements;
    private int currentPage;

    public void setHandBills(List<HandBill> handBills){
        this.handBills = handBills;
    }

    public List<HandBill> getHandBills(){
        return handBills;
    }

    public void setTotalPages(int totalPages){
        this.totalPages = totalPages;
    }

    public int getTotalPages(){
        return totalPages;
    }

    public void setTotalElements(long totalElements){
        this.totalElements = totalElements;
    }

    public long getTotalElements(){
        return totalElements;
    }

    public void setCurrentPage(int currentPage){
        this.currentPage = currentPage;
    }

    public int getCurrentPage(){
        return currentPage;
    }
}
