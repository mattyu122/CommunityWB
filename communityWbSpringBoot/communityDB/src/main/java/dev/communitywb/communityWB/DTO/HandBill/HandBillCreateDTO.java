package dev.communitywb.communityWB.DTO.HandBill;

import org.springframework.web.multipart.MultipartFile;

import dev.communitywb.communityWB.DataModel.LatLng;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HandBillCreateDTO {
    private MultipartFile file;
    private String caption;
    private Double width;
    private Double height;
    private String address;
    private LatLng location;

    @Override
    public String toString() {
        return "HandBillCreateDTO{" +
                "caption='" + caption + '\'' +
                ", width=" + width +
                ", height=" + height +
                ", address='" + address + '\'' +
                ", location=" + location +
                '}';
    }
}
