package dev.communitywb.communityWB.DTO;

import java.util.List;

import dev.communitywb.communityWB.DataModel.HandBill;
import lombok.Data;

@Data
public class HandBillPageResponse {
    private List<HandBill> handBills;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}
