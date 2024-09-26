package dev.communitywb.communityWB.DTO.HandBill;

import dev.communitywb.communityWB.DataModel.LatLng;
import lombok.Data;

@Data
public class HandBillGetDTO {
    private Long id;
    private String imageUrl;
    private String caption;
    private Double width;
    private Double height;
    private String address;
    private LatLng location;
    
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
    
    public void setWidth(Double width) {
        this.width = width;
    }
    public Double getWidth() {
        return width;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setHeight(Double height) {
        this.height = height;
    }
    public Double getHeight() {
        return height;
    }

    public void setCaption(String description) {
        this.caption = description;
    }

    public String getCaption(){
        return caption;
    }


    public Long get_id() {
        return id;
    }

    @Override
    public String toString() {
        return "HandBill{" +
                "id=" + id +
                ", caption='" + caption + '\'' +
                '}';
    }
}
