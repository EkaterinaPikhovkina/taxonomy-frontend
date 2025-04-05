import React from 'react';
import CloseIcon from "../icons/CloseIcon.jsx";
import DefaultButton from "../buttons/DefaultButton.jsx";
import ArrowDown from "../icons/ArrowDown.jsx";

function ExportModal({show, onClose, onExport}) {
    if (!show) {
        return null;
    }

    const handleExport = (format) => {
        onExport(format);
        onClose();
    };

    return (
        <div className="modal-backdrop fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="flex w-[500px] flex-col items-start bg-gray-100">

                <div className="flex px-8 py-4 justify-between items-center self-stretch bg-blue">
                    <p className="text-white text-lg font-semibold leading-normal">Експорт таксономії</p>
                    <CloseIcon className="w-4 h-4" onClick={() => {
                        onClose();
                    }}/>
                </div>

                <div className="flex p-6 flex-col items-start gap-6 self-stretch">
                    <div className="flex p-6 flex-col items-start gap-2 self-stretch rounded-[12px] bg-white">
                        <div className="flex items-center gap-12 self-stretch">
                            <label htmlFor="format"
                                   className="whitespace-nowrap text-black font-normal text-base font-inter">Формат
                                файлу</label>
                            <select
                                id="format"
                                name="format"
                                className="appearance-none flex py-3 px-4 w-full items-center self-stretch border border-dashed border-gray-500 rounded-[6px] cursor-pointer text-base"
                                defaultValue="ttl"
                            >
                                <option className="text-black text-base font-normal leading-normal" value="ttl">Turtle
                                    (.ttl)
                                </option>
                            </select>
                        </div>
                    </div>


                    <div className="self-end">
                        <DefaultButton
                            onClick={() => handleExport(document.getElementById('format').value)}
                        >
                            Імпортувати
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default ExportModal;