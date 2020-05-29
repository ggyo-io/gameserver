import React from "react";

// custom hook for getting previous value
import {useEffect, useRef} from "react";

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

