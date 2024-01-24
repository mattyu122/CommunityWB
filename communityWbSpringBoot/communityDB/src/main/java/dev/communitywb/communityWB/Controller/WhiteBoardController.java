package dev.communitywb.communityWB.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.communitywb.communityWB.DataModel.HandBill;
import dev.communitywb.communityWB.DataModel.DTO.HandBillPageResponse;
import dev.communitywb.communityWB.Service.WhiteBoard.WhiteBoardService;
@RestController
@RequestMapping("/whiteboard")
public class WhiteBoardController {

    @Autowired
    private WhiteBoardService whiteBoardService;
    
    @GetMapping
    public ResponseEntity<List<HandBill>> getAllHandBills() {
        List<HandBill> handBills = whiteBoardService.getAllHandBills();
        return new ResponseEntity<List<HandBill>>(handBills, HttpStatus.OK);
    }

    @GetMapping("/handbillpage")
    public ResponseEntity<HandBillPageResponse> getAllHandBillPages(Pageable pageable){
        Page<HandBill> handBillPage = whiteBoardService.getAllHandBillsByPage(pageable);
        HandBillPageResponse handBillPageResponse = new HandBillPageResponse();
        handBillPageResponse.setHandBills(handBillPage.getContent());
        handBillPageResponse.setTotalPages(handBillPage.getTotalPages());
        handBillPageResponse.setTotalElements(handBillPage.getTotalElements());
        handBillPageResponse.setCurrentPage(handBillPage.getNumber());
        return new ResponseEntity<HandBillPageResponse>(handBillPageResponse, HttpStatus.OK);
    }

    @PostMapping("/addHandBill")
    public ResponseEntity<?> addHandBill(
        @RequestParam("file") MultipartFile file, 
        @RequestParam("title") String title, 
        @RequestParam("description") String description,
        @RequestParam("width") String width,
        @RequestParam("height") String height) {
        HandBill handBill = new HandBill();
        handBill.setTitle(title);
        handBill.setWidth(Integer.parseInt(width));
        handBill.setHeight(Integer.parseInt(height));
        handBill.setDescription(description);
        whiteBoardService.addHandBill(handBill,file);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
