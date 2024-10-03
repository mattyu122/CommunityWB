import { HandBill } from "./HandBill";
import { Node } from "./Node";
export interface Board {
    maxWidth: number;
    maxHeight: number;
    handbills: HandBill[];
    rootNode: Node | null;
}