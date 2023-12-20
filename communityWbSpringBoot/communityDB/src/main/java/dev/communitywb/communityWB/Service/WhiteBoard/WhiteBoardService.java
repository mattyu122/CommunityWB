package dev.communitywb.communityWB.Service.WhiteBoard;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.communitywb.communityWB.DataModel.HandBill;
import dev.communitywb.communityWB.DataModel.WhiteBoard;
import dev.communitywb.communityWB.DataModel.Enum.S3BucketName;
import dev.communitywb.communityWB.Repository.HandBillRepository;
import dev.communitywb.communityWB.Service.S3.S3Service;

@Service
public class WhiteBoardService {
    @Autowired
    private S3Service s3Service;

    @Autowired
    private HandBillRepository handBillRepository;


    public WhiteBoard getWhiteBoard() {
        return new WhiteBoard();
    }


    public List<HandBill> getAllHandBills(){
        List<HandBill> handBills = handBillRepository.findAll();
        
        try{
            for (HandBill handBill : handBills) {
                System.err.println(handBill);
                String imageUrl = s3Service.getFile(S3BucketName.HANDBILL_BUCKET.toString(), handBill.getS3_key());
                handBill.setImageUrl(imageUrl);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return handBills;
    }

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
