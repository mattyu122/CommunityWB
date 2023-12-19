package dev.communitywb.communityWB.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import dev.communitywb.communityWB.DataModel.HandBill;

@Repository
public interface HandBillRepository extends MongoRepository<HandBill, ObjectId> {

    
}
