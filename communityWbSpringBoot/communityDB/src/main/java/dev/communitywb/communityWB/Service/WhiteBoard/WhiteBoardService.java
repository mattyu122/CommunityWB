package dev.communitywb.communityWB.Service.WhiteBoard;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.communitywb.communityWB.DataModel.HandBill;
import dev.communitywb.communityWB.DataModel.WhiteBoard;
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


    public void addHandBillToWhiteBoard(HandBill handbill, MultipartFile file){
        try {
            String url = s3Service.uploadFile("handbillbucket", file);
            handbill.setS3_key(url);
            handBillRepository.save(handbill);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(handbill);
        return ;
    }
}
