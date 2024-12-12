import { HandbillInteractionType } from "../../enum/HandbillInteractionType";

export interface handbillInteractionDto {
    handbillId: number;
    userId: number;
    interactionType: HandbillInteractionType;
}