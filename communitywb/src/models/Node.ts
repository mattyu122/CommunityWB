export interface Node {
    right: Node | null;
    down: Node | null;
    width: number;
    height: number;
    used: boolean;
    positionX: number;
    positionY: number;
}