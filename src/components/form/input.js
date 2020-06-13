import React from "react";

export const Input = ({ errors, register, required, name, label, type, small }) => {
    const registerOptions = {}
    if (required)
        registerOptions.required = "Required"

    if (type === "email") {
        registerOptions.pattern = {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address"
        }
    }

    return <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input type={type} name={name} id={name} placeholder={"Enter " + name} ref={register(registerOptions)}
               className={"form-control" + (errors[name] ? " is-invalid" : "")}
        />
        {errors[name] && <div className="invalid-feedback">{errors[name].message}</div>}
        {small && <small id="emailHelp" className="form-text text-muted">{small}</small>}
    </div>
}
