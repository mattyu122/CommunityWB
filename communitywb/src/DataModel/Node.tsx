class Node {
    right: Node | null = null
    down: Node | null = null
    width: number
    height: number
    used: boolean
    positionX: number
    positionY: number
    constructor(width: number, height: number, positionX: number, positionY: number) {
        this.width = width
        this.height = height
        this.positionX = positionX
        this.positionY = positionY
        this.used = false
    }
}

export default Node;