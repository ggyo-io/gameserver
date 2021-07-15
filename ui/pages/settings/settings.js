import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

export const Settings = () => {
    const {handleSubmit, register, setValue} = useForm();

    useEffect(() => {
        fetch("/api/settings", {method: "GET"})
            .then(response => {
                response.json().then(data => {
                    for (let key in data) {
                        setValue(key, data[key])
                    }
                })
            })
    }, [])

    const onSubmit = values => {
        const message = JSON.stringify(values);
        fetch("/api/settings", {method: "POST", body: message})
            .then(response => {
                response.text().then(data => {
                    // Refresh the page on purpose
                    if (response.status !== 200)
                        alert('failed to save settings ' + data)
                })
            })
    };

    return (
        //<Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="firstname" className="col-sm-2 col-form-label">First Name</label>
                        <div className="col-sm-8">
                            <input type="text" readOnly="" className="form-control" name="firstname"
                                   ref={register}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastname" className="col-sm-2 col-form-label">Last Name</label>
                        <div className="col-sm-8">
                            <input type="text" readOnly="" className="form-control" name="lastname"
                                   ref={register}/>
                        </div>
                    </div>
                    <Button className="ml-3 mt-3" type="submit">Save</Button>
                </fieldset>
            </form>
        //</Container>
    )

}
