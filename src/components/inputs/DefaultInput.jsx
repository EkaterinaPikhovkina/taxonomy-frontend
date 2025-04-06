import React from "react";

function DefaultInput({label, value, onChange, ...props}) {
    return (
        <div className="flex items-center gap-12 self-stretch">
            <div className="flex w-[200px] items-center">
                <label htmlFor="format"
                       className="whitespace-nowrap text-black font-normal text-base font-inter">{label}</label>
            </div>
            <input type="text" value={value} onChange={onChange}
                   className="block w-full px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md" {...props}/>
        </div>
    )
}

export default DefaultInput;