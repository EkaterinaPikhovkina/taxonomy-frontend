import React from 'react';
import DefaultButton from '../buttons/DefaultButton.jsx';
import CloseIcon from "../icons/CloseIcon.jsx";

function DeleteConceptModal({show, onClose, onDiscard}) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="flex w-[500px] flex-col items-start bg-gray-100">

                <div className="flex px-8 py-4 justify-between items-center self-stretch bg-blue">
                    <p className="text-white text-lg font-semibold leading-normal">Видалити концепт?</p>
                    <CloseIcon className="w-4 h-4" onClick={onDiscard}/>
                </div>

                <div className="flex p-6 flex-col items-start gap-6 self-stretch">
                    <p>При видаленні концепту видаляються всі його нащадки.</p>

                    <div className="self-end">
                        <DefaultButton onClick={onClose}>
                            Видалити
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConceptModal;