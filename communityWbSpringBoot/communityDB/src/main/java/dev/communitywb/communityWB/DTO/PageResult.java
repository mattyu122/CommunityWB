package dev.communitywb.communityWB.DTO;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Data;

@Data
public class PageResult<T> {
    private List<T> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;

    public PageResult(Page<T> page, int currentPage) {
        this.content = page.getContent();
        this.currentPage = currentPage;
        this.pageSize = page.getSize();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
    }

    // Getters and setters
}