package dev.communitywb.communityWB.Service.WhiteBoard;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.communitywb.communityWB.DTO.PageResult;
import dev.communitywb.communityWB.DataModel.HandBill;
import dev.communitywb.communityWB.DataModel.WhiteBoard;
import dev.communitywb.communityWB.Enum.S3BucketName;
import dev.communitywb.communityWB.Repository.HandBillRepository;
import dev.communitywb.communityWB.Service.S3.S3Service;

@Service
public class WhiteBoardService {


    @Autowired
    private HandBillRepository handBillRepository;

    @Autowired
    private S3Service s3Service;




    public WhiteBoard getWhiteBoard() {
        return new WhiteBoard();
    }

    public PageResult<HandBill> getAllHandBillsByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HandBill> handBillPages = handBillRepository.findAll(pageable);

        List<HandBill> handBills = handBillPages.getContent().stream()
            .map(this::setImageUrl)
            .collect(Collectors.toList());

        
        PageImpl<HandBill> handBillPage = new PageImpl<>(handBills, pageable, handBillPages.getTotalElements());
        int currentPage = handBillPage.getNumber();
        PageResult<HandBill> pageResult = new PageResult<>(handBillPage, currentPage);
        return pageResult;
    }

    private HandBill setImageUrl(HandBill handBill){
        try {
            String imageUrl = s3Service.getFile(S3BucketName.HANDBILL_BUCKET.toString(), handBill.getS3_key());
            handBill.setImageUrl(imageUrl);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return handBill;
    }

    // public List<HandBill> getAllHandBills(){
    //     List<HandBill> handBills = handBillRepository.findAll();
        
    //     try{
    //         for (HandBill handBill : handBills) {
    //             System.err.println(handBill);
    //             String imageUrl = s3Service.getFile(S3BucketName.HANDBILL_BUCKET.toString(), handBill.getS3Key());
    //             handBill.setImageUrl(imageUrl);
    //         }
    //     }catch(Exception e){
    //         e.printStackTrace();
    //     }
    //     return handBills;
    // }

    public void addHandBill(HandBill handbill, MultipartFile file){
        try {
            String url = s3Service.uploadFile(S3BucketName.HANDBILL_BUCKET.toString(), file);
            handbill.setS3_key(url);
            handBillRepository.save(handbill);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(handbill);
        return ;
    }
}
