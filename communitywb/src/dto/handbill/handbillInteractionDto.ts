import { HandbillInteractionType } from "../../data/enum/HandbillInteractionType";

export interface handbillInteractionDto {
    handbillId: number;
    userId: number;
    interactionType: HandbillInteractionType;
}