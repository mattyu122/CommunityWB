package dev.communitywb.communityWB.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.communitywb.communityWB.DataModel.HandBill;
import dev.communitywb.communityWB.Service.WhiteBoard.WhiteBoardService;
@RestController
@RequestMapping("/whiteboard")
@CrossOrigin(origins = "http://localhost:3001") // or use @CrossOrigin on specific methods
public class WhiteBoardController {

    @Autowired
    private WhiteBoardService whiteBoardService;
    
    // @GetMapping
    // public ResponseEntity<List<HandBill>> getHandBillsWhiteBoard(@PathVariable ObjectId whiteBoardId) {
    //     List<HandBill> handBills = whiteBoardService.getHandBillsForWhiteBoard(whiteBoardId);
    //     return  new ResponseEntity<List<HandBill>>(handBills, HttpStatus.OK);
    // }

    @PostMapping("/addHandBill")
    public ResponseEntity<?> addHandBillToWhiteBoard(@RequestParam("file") MultipartFile file, @RequestParam("title") String title, @RequestParam("description") String description, @RequestParam("imageId") String imageId) {
        HandBill handBill = new HandBill();
        handBill.setTitle(title);
        handBill.setDescription(description);
        whiteBoardService.addHandBill(handBill,file);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
