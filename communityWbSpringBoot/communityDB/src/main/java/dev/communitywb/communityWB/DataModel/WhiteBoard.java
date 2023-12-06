package dev.communitywb.communityWB.DataModel;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "WhiteBoard")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WhiteBoard {
    @Id
    private ObjectId _id;

    private List<ObjectId> handbillIds;
    private Integer height;
    private Integer width;
    private Integer count;
    private String name;
    private String description;
    private String location;
}
