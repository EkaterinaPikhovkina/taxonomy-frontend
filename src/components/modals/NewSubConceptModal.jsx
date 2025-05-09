import React, {useState} from 'react';
import CloseIcon from "../icons/CloseIcon.jsx";
import DefaultButton from "../buttons/DefaultButton.jsx";
import DefaultInput from "../inputs/DefaultInput.jsx";

function NewSubConceptModal({show, onClose, onCreate, parentConcept}) {
    const [conceptName, setConceptName] = useState('');

    if (!show) {
        return null;
    }

    const handleCreate = () => {
        if (!conceptName) {
            alert("Назва концепту є обов'язковою!");
            return;
        }

        const conceptData = {
            conceptName: conceptName,
            parentConceptUri: parentConcept.key
        };


        console.log("Data being sent to create concept:", conceptData);

        onCreate(conceptData);
        onClose();

        setConceptName('');
    };

    return (
        <div className="modal-backdrop fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="flex w-[500px] flex-col items-start bg-gray-100">

                <div className="flex px-8 py-4 justify-between items-center self-stretch bg-blue">
                    <p className="text-white text-lg font-semibold leading-normal">Новий клас</p>
                    <CloseIcon className="w-4 h-4" onClick={() => {
                        onClose();
                    }}/>
                </div>

                <div className="flex p-6 flex-col items-start gap-6 self-stretch">
                    <div className="flex p-6 flex-col items-start gap-2 self-stretch rounded-[12px] bg-white">
                        <div className="flex flex-col items-center gap-4 self-stretch">
                            <DefaultInput label="Назва класу *" value={conceptName}
                                          onChange={(e) => setConceptName(e.target.value)}/>
                            </div>
                    </div>

                    <div className="self-end">
                        <DefaultButton
                            onClick={() => handleCreate()}
                        >
                            Створити
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewSubConceptModal;