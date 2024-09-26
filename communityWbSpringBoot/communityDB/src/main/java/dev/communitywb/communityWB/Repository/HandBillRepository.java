package dev.communitywb.communityWB.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.communitywb.communityWB.DataModel.HandBill;

@Repository
public interface HandBillRepository extends JpaRepository<HandBill, Long> {

}
