import React, {useState} from "react";
import {Input} from "../../components/form/input";
import {AuthForm} from "../../components/auth/authform";
import {useForm} from "react-hook-form";

export const Login = () => {
    const [srvErr, setSrvErr] = useState(null)
    const {handleSubmit, register, errors} = useForm();
    const onSubmit = values => {
        const message = JSON.stringify(values);
        fetch("/api/login", {method: "POST", body: message})
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
            name="Sign in"
            onSubmit={handleSubmit(onSubmit)}
            links={[{to: "/signup", name: "Create account"}, {to: "/reset", name: "Password reset"}]}
            srvErr={srvErr}
        >
            <Input name="username" label="Username" errors={errors} register={register} required setSrvErr={setSrvErr}/>
            <Input name="password" type="password" label="Password"
                   errors={errors} register={register} required setSrvErr={setSrvErr}/>
        </AuthForm>
    )
}
