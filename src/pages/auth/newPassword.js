import React, {useState} from "react";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";
import {useForm} from "react-hook-form";

export const NewPassword = (props) => {
    const [srvErr, setSrvErr] = useState(null)
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = values => {
        
        console.log(props)
        const tokenKey='?token='
        console.log("search: " + props.location.search)
        if (props.location.search.startsWith(tokenKey)) {   
            values.token = props.location.search.substring(tokenKey.length).replace(/\r$/, "")
            console.log("mached token: " + values.token)
        } else console.log("no match: " + tokenKey)
        console.log(JSON.stringify(values))
        
        const message = JSON.stringify(values)
        fetch("/api/newPassword", {method: "POST", body: message})
            .then(response => {
                response.text().then(data => {
                    setSrvErr(data)
                })
            })
    };

    return (
        <AuthForm
            name="New password"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/login", name: "Sign in"}, {to: "/signup", name: "Create account"}]}
            srvErr={srvErr}
        >
            <Input name="password" type="password" label="Password" setSrvErr={setSrvErr}
                   errors={errors} register={register} required/>
        </AuthForm>
    )
}
