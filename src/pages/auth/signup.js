import React from "react";
import {useForm} from "react-hook-form";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";

export const Signup = () => {
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = values => {
        const message = JSON.stringify(values);
        fetch("/api/register", {method: "POST", body: message})
            .then(response => {
                console.log(response)
            })
    };
    return (
        <AuthForm
            name="Sign up"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/login", name: "Sign in"}, {to: "/reset", name: "Password reset"}]}
        >
            <Input name="username" label="Username" errors={errors} register={register} required/>
            <Input name="password" type="password" label="Password"
                   errors={errors} register={register} required/>
            <Input name="email" type="email" label="Email"
                   small="We'll only use it to reset password."
                   errors={errors} register={register} required/>
        </AuthForm>
    )
}
