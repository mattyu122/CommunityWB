import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHandbillIdQuery, useHandbillInteractionMutation } from '../../api/handbill/handBillQuery';
import styles from '../../css/HandBillLayer.module.css';
import { HandbillInteractionType } from '../../enum/HandbillInteractionType';
import { Board } from '../../models/Board';
import { HandBill } from '../../models/HandBill';
import { useBrowsedHandbillsStore } from '../../stores/browsedHandBillStore';
import { useUserStore } from '../../stores/userStateStore';
import HandBillComponent from './HandbillComponent';
import HandbillModal from './HandbillModal/ContentTab/HandbillModal';

interface HandbillLayerProps {
    boardList: Board[];
    onHandBillHover: (handBillId: number | null) => void;
}

const HandbillLayer: React.FC<HandbillLayerProps> = ({ boardList, onHandBillHover }) => {
    const [selectedHandBill, setSelectedHandBill] = useState<HandBill | null>(null);
    const { browsedHandbills } = useBrowsedHandbillsStore();
    const { user } = useUserStore();
    const { mutate: addHandBillInteraction } = useHandbillInteractionMutation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: queriedHandBill, refetch, isLoading, isSuccess } = useHandbillIdQuery(
        id ? parseInt(id, 10) : null
    );

    const onHandbillClick = useCallback(
        (handBill: HandBill) => {
            if(!user){
                return;
            }
            addHandBillInteraction({
                handbillId: handBill.id,
                interactionType: HandbillInteractionType.CLICK,
                userId: user.id,
            })
            setSelectedHandBill(handBill);
        },
        []
    )

    const closeModal = () => {
        setSelectedHandBill(null);
        navigate('/'); // Navigate back to the main page
    };

    useEffect(() => {
        if (id) {
            // Try to find the handbill in the current boardList
            const handBill = boardList
                .flatMap((board) => board.handbills)
                .find((hb) => hb.id === parseInt(id, 10));

            if (handBill) {
                console.log('Handbill found in boardList');
                setSelectedHandBill(handBill);
            } else {
                console.log('refetching')
                // Trigger the manual query if the handbill is not found in boardList
                refetch();
            }
        }
    }, [id, boardList, refetch]);

    useEffect(() => {
        if (isSuccess && queriedHandBill) {
            setSelectedHandBill(queriedHandBill);
        }
    }, [isSuccess, queriedHandBill]);

    return (
        <div>
            {boardList.map((board, boardIndex) => (
                <div
                    key={boardIndex}
                    className={styles.photoDisplay}
                    style={{ width: board.maxWidth, height: board.maxHeight }}
                >
                    {board.handbills.map((handBill) => {
                        const isBrowsed = browsedHandbills.some((entry) => entry.id === handBill.id);

                        return (
                            <div
                                key={handBill.id}
                                style={{
                                    position: 'absolute',
                                    width: `${handBill.width}px`,
                                    height: `${handBill.height}px`,
                                    left: `${handBill.positionX}px`,
                                    top: `${handBill.positionY}px`,
                                }}
                                onMouseEnter={() => onHandBillHover(handBill.id)}
                                onMouseLeave={() => onHandBillHover(null)}
                            >
                                <HandBillComponent
                                    handBill={handBill}
                                    onClickHandBillHandler={onHandbillClick}
                                    isBrowsed={isBrowsed}
                                />
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Conditionally render HandbillModal */}
            {isLoading && <div>Loading...</div>}
            {selectedHandBill && (
                <HandbillModal closeModal={closeModal} selectedHandBill={selectedHandBill} />
            )}
        </div>
    );
};

export default React.memo(HandbillLayer);