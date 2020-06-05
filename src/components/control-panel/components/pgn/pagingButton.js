import React from "react";


const Arrow = ({name}) => {
    if (name === "Flip")
        return <span aria-hidden="true">&#8635;</span>
    if (name === "First")
        return <span aria-hidden="true">&laquo;</span>
    if (name === "Previous")
        return <span aria-hidden="true">&lsaquo;</span>
    if (name === "Next")
        return <span aria-hidden="true">&rsaquo;</span>
    // Last
    // if (name === "Last")
    return <span aria-hidden="true">&raquo;</span>
}

export const PagingButton = (props) => {
    const {name, onClick} = props
    const handleClick = (e) => {
        e.preventDefault();
        onClick()
    };
    return <li title={name} className="page-item">
        <a className="page-link" href="#" aria-label={name} onClick={handleClick}>
            <Arrow name={name}/>
        </a>
    </li>
}
