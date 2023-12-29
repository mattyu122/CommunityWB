import HandBill from "./Handbill"
import Node from "./Node"
class Board {
    maxWidth: number
    maxHeight: number
    handbills: HandBill[]
    rootNode: Node | null
    constructor(width: number, height: number) {
        this.maxWidth = width
        this.maxHeight = height
        this.handbills = []
        this.rootNode = new Node(this.maxWidth, this.maxHeight, 0, 0)
    }


    addHandBill(handBill: HandBill): boolean {
        const node = this.FindNode(handBill, this.rootNode)
        console.log(node)
        if (node != null){
            this.splitNode(node, handBill.width, handBill.height)
            handBill.positionX = node.positionX
            handBill.positionY = node.positionY
            this.handbills.push(handBill)
            console.log(handBill)
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
        if (rightNode && downNode){
            if (curNode.positionY + curNode.height + billHeight > curNode.positionX + curNode.width + billWidth){
                return rightNode
            }else{
                return downNode
            }
        }else if (rightNode){
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

    private splitNode(node: Node, billWidth: number, billHeight: number): Node{
        node.used = true
        node.down = new Node(node.width, node.height - billHeight, node.positionX, node.positionY + billHeight)
        node.right = new Node(node.width - billWidth, billHeight, node.positionX + billWidth, node.positionY)
        node.width = billWidth
        node.height = billHeight
        return node
    }
}

export default Board