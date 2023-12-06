package dev.communitywb.communityWB.DataModel;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "HandBill")
public class HandBill {
    @Id
    private ObjectId _id;
    private String s3_key;
    private String title;
    private String description;
    private String imageId;

    public void setTitle(String title) {
        this.title = title;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    public ObjectId get_id() {
        return _id;
    }

    public void setS3_key(String s3_key) {
        this.s3_key = s3_key;
    }

    public String getS3_key() {
        return s3_key;
    }

    @Override
    public String toString() {
        return "HandBill{" +
                "_id=" + _id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", imageId='" + imageId + '\'' +
                '}';
    }
}
