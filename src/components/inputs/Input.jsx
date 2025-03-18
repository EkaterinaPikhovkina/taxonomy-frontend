import React from "react";

function Input({label, value, onChange, ...props}){
    return (
        <div>
            <label>
                {label}
                <input type="text" value={value} onChange={onChange} {...props}/>
            </label>
        </div>
    )
}

export default Input;