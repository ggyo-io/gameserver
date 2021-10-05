import React from "react";

export const Input = ({ register, required, name, label, type, small, setSrvErr, autofocus }) => {
    const registerOptions = {}
    if (required)
        registerOptions.required = "Required"

    return <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input type={type} name={name} id={name} placeholder={"Enter " + name} {...register(name, registerOptions)}
               className={"form-control"}
               onChange={()=>setSrvErr('')}
               autoFocus={autofocus}
        />
        {small && <small id="emailHelp" className="form-text text-muted">{small}</small>}
    </div>
}
