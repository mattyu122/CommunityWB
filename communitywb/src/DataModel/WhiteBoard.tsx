import Board from "./Board";
import HandBill from "./Handbill";

class WhiteBoard{
    location: String;
    boardList: Board[];
    maxWidth: number;
    maxHeight: number;
    constructor(location: String){
        this.location = location;
        this.maxWidth = window.innerWidth;
        this.maxHeight = window.innerHeight*1.5;
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
            while(!this.boardList[this.boardList.length-1].addHandBill(handBill)){
                this.boardList.push(new Board(this.maxWidth, this.maxHeight));
            }
        })
    }

}

export default WhiteBoard;