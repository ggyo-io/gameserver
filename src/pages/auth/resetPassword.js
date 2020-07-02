import React, {useState} from "react";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";
import {useForm} from "react-hook-form";

export const ResetPassword = () => {
    const [srvErr, setSrvErr] = useState(null)
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = values => {
        console.log(JSON.stringify(values))
        const message = JSON.stringify(values)
        fetch("/api/passwordReset", {method: "POST", body: message})
            .then(response => {
                response.text().then(data => {
                    qsetSrvErr(data)
                })
            })
    };

    return (
        <AuthForm
            name="Password reset"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/login", name: "Sign in"}, {to: "/signup", name: "Create account"}]}
            srvErr={srvErr}
        >
            <Input name="username" label="Username"
                   errors={errors} register={register} required setSrvErr={setSrvErr}/>
        </AuthForm>
    )
}
