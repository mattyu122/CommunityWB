package dev.communitywb.communityWB.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.communitywb.communityWB.DTO.HandBill.HandBillCreateDTO;
import dev.communitywb.communityWB.DTO.HandBill.HandBillGetDTO;
import dev.communitywb.communityWB.DTO.HandBill.HandBillPageResponseDTO;
import dev.communitywb.communityWB.Service.WhiteBoard.WhiteBoardService;
@RestController
@RequestMapping("/whiteboard")
public class WhiteBoardController {

    @Autowired
    private WhiteBoardService whiteBoardService;
    
    // @GetMapping
    // public ResponseEntity<List<HandBill>> getAllHandBills() {
    //     List<HandBill> handBills = whiteBoardService.getAllHandBills();
    //     return new ResponseEntity<List<HandBill>>(handBills, HttpStatus.OK);
    // }

    @GetMapping("/handbillpage")
    public ResponseEntity<HandBillPageResponseDTO> getAllHandBillPages(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size)
        {
            System.out.println("Page: " + page + " Size: " + size);
            Page<HandBillGetDTO> handBillPage = whiteBoardService.getAllHandBillsByPage(page, size);

            HandBillPageResponseDTO handBillPageResponse = new HandBillPageResponseDTO();
            handBillPageResponse.setHandBills(handBillPage.getContent());
            handBillPageResponse.setCurrentPage(handBillPage.getNumber());
            handBillPageResponse.setPageSize(handBillPage.getSize());
            handBillPageResponse.setTotalElements(handBillPage.getTotalElements());
            handBillPageResponse.setTotalPages(handBillPage.getTotalPages());
    
            return new ResponseEntity<>(handBillPageResponse, HttpStatus.OK);
    }

    @PostMapping("/addHandBill")
    public ResponseEntity<?> addHandBill(
        @ModelAttribute HandBillCreateDTO handBillCreateDTO) {
            System.out.println("Page: " + handBillCreateDTO);

        whiteBoardService.addHandBill(handBillCreateDTO);
        return ResponseEntity.ok("Handbill uploaded successfully.");
    }
}
