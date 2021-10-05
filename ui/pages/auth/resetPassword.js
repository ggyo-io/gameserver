import React, {useState} from "react";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";
import {useForm} from "react-hook-form";

export const ResetPassword = () => {
    const [srvErr, setSrvErr] = useState(null)
    const [srvInfo, setSrvInfo] = useState(null)
    const {handleSubmit, register} = useForm();
    const onSubmit = values => {
        console.log(JSON.stringify(values))
        const message = JSON.stringify(values)
        fetch("/api/passwordReset", {method: "POST", body: message})
            .then(response => {
                setSrvInfo(null)
                setSrvErr(null)
                if (response.ok) {
                    setSrvInfo("The mail with the reset URL has been sent to the email address you have provided during registration, please check you mailbox...")
                }
                response.text().then(data => {
                    setSrvErr(data)
                })
            })
    };

    return (
        <AuthForm
            name="Password reset"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/login", name: "Sign in"}, {to: "/signup", name: "Create account"}]}
            srvErr={srvErr} srvInfo={srvInfo}
        >
            <Input name="username" label="Username"
                   register={register} required setSrvErr={setSrvErr}/>
        </AuthForm>
    )
}
