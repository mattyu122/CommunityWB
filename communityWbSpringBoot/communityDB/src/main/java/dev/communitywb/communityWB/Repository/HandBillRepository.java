package dev.communitywb.communityWB.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import dev.communitywb.communityWB.DataModel.HandBill;

public interface HandBillRepository extends MongoRepository<HandBill, ObjectId> {

    
}
