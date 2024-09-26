package dev.communitywb.communityWB.DataModel;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Embeddable
public class LatLng {

    private Double lat;
    private Double lng;


    // Constructor
    public LatLng(Double lat, Double lng, Double alt) {
        this.lat = lat;
        this.lng = lng;
    }

    @Override
    public String toString() {
        return "LatLng{" +
                "lat=" + lat +
                ", lng=" + lng +
                '}';
    }
}
