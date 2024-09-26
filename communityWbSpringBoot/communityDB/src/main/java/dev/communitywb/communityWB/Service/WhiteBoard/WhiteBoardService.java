package dev.communitywb.communityWB.Service.WhiteBoard;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import dev.communitywb.communityWB.DTO.HandBill.HandBillCreateDTO;
import dev.communitywb.communityWB.DTO.HandBill.HandBillGetDTO;
import dev.communitywb.communityWB.DataModel.HandBill;
import dev.communitywb.communityWB.Enum.S3BucketName;
import dev.communitywb.communityWB.Repository.HandBillRepository;
import dev.communitywb.communityWB.Service.S3.S3Service;
import dev.communitywb.communityWB.mapper.HandBillMapper;

@Service
public class WhiteBoardService {

    private final HandBillMapper handBillMapper = HandBillMapper.INSTANCE;

    @Autowired
    private HandBillRepository handBillRepository;

    @Autowired
    private S3Service s3Service;


    public Page<HandBillGetDTO> getAllHandBillsByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HandBill> handBillPages = handBillRepository.findAll(pageable);

        Page<HandBillGetDTO> handBillDTOPage = handBillPages.map(handBill -> {
            HandBillGetDTO handBillDTO = handBillMapper.handBillToHandBillGetDTO(handBill);
            String imageUrl = getImageUrl(handBill);
            handBillDTO.setImageUrl(imageUrl);
            return handBillDTO;
        });
    

        return handBillDTOPage;
    }

    private String getImageUrl(HandBill handBill){
        String imageUrl = null;
        try {
            imageUrl = s3Service.getFile(S3BucketName.HANDBILL_BUCKET.toString(), handBill.getS3_key());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return imageUrl;
    }


    public void addHandBill(HandBillCreateDTO handbillCreateDto){
        try {
            HandBill handBill = handBillMapper.handBillCreateDTOToHandBill(handbillCreateDto);
            String url = s3Service.uploadFile(S3BucketName.HANDBILL_BUCKET.toString(), handbillCreateDto.getFile());
            
            handBill.setS3_key(url);
            handBillRepository.save(handBill);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ;
    }
}
