import React from "react";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";
import {useForm} from "react-hook-form";

export const Login = () => {
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = values => {
        const message = JSON.stringify(values);
        fetch("/api/login", {method: "POST", body: message})
            .then(response => {
                response.text().then(data => {
                    console.log(response.status + ": " + data)
                })
            })
    };
    return (
        <AuthForm
            name="Sign in"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/signup", name: "Sign un"}, {to: "/reset", name: "Password reset"}]}
        >
            <Input name="username" label="Username" errors={errors} register={register} required/>
            <Input name="password" type="password" label="Password"
                   errors={errors} register={register} required/>
        </AuthForm>
    )
}
