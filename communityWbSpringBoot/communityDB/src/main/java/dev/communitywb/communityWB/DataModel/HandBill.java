package dev.communitywb.communityWB.DataModel;



import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "handbill")
public class HandBill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String s3_key;
    private String caption;
    private Double width;
    private Double height;
    private String address;

    @Embedded
    private LatLng location;
    

    @Override
    public String toString() {
        return "HandBill{" +
                "id=" + id +
                ", caption='" + caption + '\'' +
                ", width=" + width +
                ", height=" + height +
                ", address='" + address + '\'' +
                ", location=" + location +
                '}';
    }
}
