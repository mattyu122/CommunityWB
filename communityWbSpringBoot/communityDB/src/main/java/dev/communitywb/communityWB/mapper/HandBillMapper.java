package dev.communitywb.communityWB.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import dev.communitywb.communityWB.DTO.HandBill.HandBillCreateDTO;
import dev.communitywb.communityWB.DTO.HandBill.HandBillGetDTO;
import dev.communitywb.communityWB.DataModel.HandBill;

@Mapper
public interface HandBillMapper {
    HandBillMapper INSTANCE = Mappers.getMapper(HandBillMapper.class);

    // Maps HandBill entity to HandBillGetDTO
    HandBillGetDTO handBillToHandBillGetDTO(HandBill handBill);

    // Maps HandBillCreateDTO to HandBill entity
    HandBill handBillCreateDTOToHandBill(HandBillCreateDTO dto);
}