package dev.communitywb.communityWB.DTO.HandBill;

import java.util.List;

import lombok.Data;

@Data
public class HandBillPageResponseDTO {
    private List<HandBillGetDTO> handBills;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
}
