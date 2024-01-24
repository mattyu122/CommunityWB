import HandBill from "./HandBill/Handbill"
import Node from "./Node"
class Board {
    maxWidth: number
    maxHeight: number
    handbills: HandBill[]
    rootNode: Node | null
    gapBtwHandBills: number = 5
    constructor(width: number, height: number) {
        this.maxWidth = width
        this.maxHeight = height
        this.handbills = []
        this.rootNode = new Node(this.maxWidth, this.maxHeight, 0, 0)
    }


    addHandBill(handBill: HandBill): boolean {
        const node = this.FindNode(handBill, this.rootNode)
        if (node != null){
            this.splitNode(node, handBill.width, handBill.height)
            handBill.positionX = node.positionX
            handBill.positionY = node.positionY
            this.handbills.push(handBill)
            return true
        }

        return false
    }

    private FindNode(handbill: HandBill, node:Node| null):Node | null {
        if(node?.used){
            const rightNode = this.FindNode(handbill,node?.right!)
            const downNode = this.FindNode(handbill,node?.down!)
            return this.nodeToBeUsed(node, rightNode, downNode, handbill.width, handbill.height)
        }
        else if( handbill.width <= node?.width! && handbill.height <= node?.height!){
            return node
        }

        return null
    }

    //Try to maintain a squarish board
    private nodeToBeUsed(curNode: Node,rightNode: Node | null, downNode: Node | null, billWidth: number, billHeight: number): Node | null {
        if (rightNode){
            return rightNode
        }
        else if (downNode){
            return downNode
        }

        return null
    }

    // private canGrowDown(billWidth: number, billHeight: number, node: Node): boolean {
    //     return (billWidth <= node.width)
    // }

    // private canGrowRight(billWidth: number, billHeight: number, node: Node): boolean {
    //     return (billHeight <= node.height)
    // }

    private splitNode(node: Node, billWidth: number, billHeight: number): void{
        node.used = true
        node.down = new Node(node.width, node.height - billHeight - this.gapBtwHandBills, node.positionX, node.positionY + billHeight + this.gapBtwHandBills)
        node.right = new Node(node.width - billWidth - this.gapBtwHandBills, billHeight, node.positionX + billWidth + this.gapBtwHandBills, node.positionY)
        node.width = billWidth + this.gapBtwHandBills
        node.height = billHeight + this.gapBtwHandBills
        return ;
    }
}

export default Board