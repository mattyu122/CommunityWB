import Board from "./Board";
import HandBill from "./HandBill/Handbill";

class WhiteBoard{
    location: String;
    boardList: Board[];
    handbills: HandBill[];
    totalPages: number;
    totalHandbill: number;
    currentPage: number;
    maxWidth: number;
    maxHeight: number;
    constructor(location: String){
        this.handbills = [];
        this.totalPages = 0;
        this.totalHandbill = 0;
        this.currentPage = 0;
        this.location = location;
        this.maxWidth = window.innerWidth;
        this.maxHeight = window.innerHeight;
        this.boardList = [new Board(this.maxWidth, this.maxHeight)];
    }

    addHandBillToBoards(handBills: HandBill[]): void {
        handBills.sort((a, b) => {
            if(b.height === a.height){
                return b.width - a.width;
            }
            return b.height - a.height;
        });
        handBills.forEach(handBill => {
            for ( const board of this.boardList){
                if(board.addHandBill(handBill)){
                    return;
                }
            }
            this.boardList.push(new Board(this.maxWidth, this.maxHeight));
            this.boardList[this.boardList.length-1].addHandBill(handBill)
        })
    }

}

export default WhiteBoard;