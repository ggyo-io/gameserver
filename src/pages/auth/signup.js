import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";

export const Signup = () => {
    const [srvErr, setSrvErr] = useState(null)
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = values => {
        const message = JSON.stringify(values);
        fetch("/api/register", {method: "POST", body: message})
            .then(response => {
                response.text().then(data => {
                    // Refresh the page on purpose
                    if (response.status === 200)
                        window.location.href = "/"
                    else
                        setSrvErr(data)
                })
            })
    };
    return (
        <AuthForm
            name="Sign up"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/login", name: "Sign in"}, {to: "/reset", name: "Password reset"}]}
            srvErr={srvErr}
        >
            <Input name="username" label="Username" autofocus
                   errors={errors} register={register} required setSrvErr={setSrvErr}/>
            <Input name="password" type="password" label="Password" setSrvErr={setSrvErr}
                   errors={errors} register={register} required/>
            <Input name="email" type="email" label="Email"
                   small="We'll only use it to reset password."
                   errors={errors} register={register} required setSrvErr={setSrvErr}/>
        </AuthForm>
    )
}
