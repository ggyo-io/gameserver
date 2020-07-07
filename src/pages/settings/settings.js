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
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row><label>First Name</label></Row>
                <Row><input name="firstname" type="text" ref={register}/></Row>
                <Row className="mt-3"><label>Last Name</label></Row>
                <Row><input name="lastname" type="text" ref={register}/></Row>
                <Row className="mt-3"><Button type="submit">Save</Button></Row>
            </form>
        </Container>
    )

}
