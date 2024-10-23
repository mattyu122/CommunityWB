import { Board } from "../models/Board";
import { HandBill } from "../models/HandBill";
import { Node } from "../models/Node";

export const processHandBills = (currentBoardList: Board[], handBills: HandBill[]): Board[] => {
    if (!Array.isArray(currentBoardList) || !Array.isArray(handBills)) {
        console.error("Invalid inputs passed to processHandBills. Expected arrays.");
        return [];
    }
    if (handBills.length === 0) {
        return currentBoardList;
    }
    let updatedBoardList = [...currentBoardList];

    handBills.forEach(handBill => {
            const result = addHandBillToBoards(updatedBoardList, handBill);
            updatedBoardList = result.boardList;

    });

    return updatedBoardList;
};

const addHandBillToBoards = (boardList: Board[], handBill: HandBill): { boardList: Board[] } => {
    for (let i = 0; i < boardList.length; i++) {
        const board = boardList[i];
        const result = addHandBillToBoard(board, handBill);

        if (result.added) {
            const updatedBoardList = [...boardList];
            updatedBoardList[i] = result.board;
            return { boardList: updatedBoardList };
        }
    }

    // If not added to existing boards, create a new board
    const newBoard = createNewBoardWithHandBill(handBill);
    return { boardList: [...boardList, newBoard] };
};

export const addHandBillToBoard = (board: Board, handBill: HandBill): { added: boolean; board: Board } => {
    const { updatedNode: updatedRootNode, found, positionX, positionY } = findAndSplitNode(board.rootNode, handBill.width, handBill.height);

    if (found && positionX !== undefined && positionY !== undefined) {
        const updatedHandbill = { ...handBill, positionX, positionY };
        const updatedHandbills = [...board.handbills, updatedHandbill];
        const updatedBoard = {
            ...board,
            handbills: updatedHandbills,
            rootNode: updatedRootNode,
        };
        return { added: true, board: updatedBoard };
    }

    return { added: false, board };
};

function findAndSplitNode(node: Node | null, width: number, height: number): { updatedNode: Node | null; found: boolean; positionX?: number; positionY?: number } {
    if (!node) return { updatedNode: null, found: false };

    if (node.used) {
        const rightResult = findAndSplitNode(node.right, width, height);
        if (rightResult.found) {
            const updatedNode = { ...node, right: rightResult.updatedNode };
            return { updatedNode, found: true, positionX: rightResult.positionX, positionY: rightResult.positionY };
        }

        const downResult = findAndSplitNode(node.down, width, height);
        if (downResult.found) {
            const updatedNode = { ...node, down: downResult.updatedNode };
            return { updatedNode, found: true, positionX: downResult.positionX, positionY: downResult.positionY };
        }

        return { updatedNode: node, found: false };
    } else if (width <= node.width && height <= node.height) {
        // Split the node here
        const updatedNode = splitNode(node, width, height);
        return { updatedNode, found: true, positionX: node.positionX, positionY: node.positionY };
    } else {
        return { updatedNode: node, found: false };
    }
}

function splitNode(node: Node, width: number, height: number): Node {
    const gap = 5;
    const usedNode = { ...node, used: true };
    const downNodeHeight = node.height - height - gap;
    const rightNodeWidth = node.width - width - gap;

    const downNode: Node | null = downNodeHeight > 0 ? {
        right: null,
        down: null,
        used: false,
        width: node.width,
        height: downNodeHeight,
        positionX: node.positionX,
        positionY: node.positionY + height + gap,
    } : null;

    const rightNode: Node | null = rightNodeWidth > 0 ? {
        right: null,
        down: null,
        used: false,
        width: rightNodeWidth,
        height: height,
        positionX: node.positionX + width + gap,
        positionY: node.positionY,
    } : null;

    const updatedNode = {
        ...usedNode,
        width: width + gap,
        height: height + gap,
        down: downNode,
        right: rightNode,
    };

    return updatedNode;
}

export const createNewBoardWithHandBill = (handBill: HandBill): Board => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const rootNode: Node = {
        right: null,
        down: null,
        used: false,
        width: maxWidth,
        height: maxHeight,
        positionX: 0,
        positionY: 0,
    };

    const { updatedNode: updatedRootNode, found, positionX, positionY } = findAndSplitNode(rootNode, handBill.width, handBill.height);
    if (found && positionX !== undefined && positionY !== undefined) {
        const updatedHandbill = { ...handBill, positionX, positionY };
        return {
            maxWidth,
            maxHeight,
            handbills: [updatedHandbill],
            rootNode: updatedRootNode,
        };
    } else {
        // Handle the case where the handbill doesn't fit
        return {
            maxWidth,
            maxHeight,
            handbills: [],
            rootNode,
        };
    }
};