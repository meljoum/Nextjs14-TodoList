import { useEffect, useMemo, useRef, useState } from "react";

const calculateIncome = () => {
    let number = 10;
    for(let i = 0; i < 10000; i++) {
        number = number + 1;
    }
    console.log("### Calculating...")
    return number;
}

function Counter() {

    const [counter, setCounter] = useState(0);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [shouldCalculate, setShouldCalculate] = useState(false);
    const memoizedValue = useMemo(() => calculateIncome(), [shouldCalculate]); //* useMemo it's like useEffect, but useMemo when we have a calculate number or something and i don't want to rerendreing every time and take the value of the caluculating 
                                                                               //* but useEffect we use it if we have a logical test of state 

    const addCounter = () => {
        setCounter(counter + 1);
        if(counter === 5) {
            setSuccess(true)
            setShouldCalculate(true)
        } 
    }
    const minsCounter = () => {
        if(counter > 0 )
            setCounter(counter - 1);
    } 

    if(inputRef.current) {
        inputRef.current.focus();
    }
    console.log(inputRef.current?.value)
    

    useEffect(() => {
        console.log('# Successs :::!!!')  //* this rendring only if the counter = 5 
    }, [success]);

    useEffect(() => {
        console.log('## Counter is Treggered :::!!!')  //* this rendring only if the counter change 
    }, [counter]);

    //console.log('rendring :::!!!')  //* this renring all time when we have an event
    
    return(
        <>
            <div className="flex gap-4">
                <button className="bg-lime-400 px-1" onClick={addCounter}>+</button>
                <h3>Counter : {counter}</h3>
                <button className="bg-orange-400 px-1" onClick={minsCounter}>-</button>
            </div>
            <div>
                <input type="text" className="p-2 rounded border-x-fuchsia-900" name="nom" id="nom" ref={inputRef} />
            </div>
            <h4>MemoizedValue :{memoizedValue}</h4>
        </>
    )
}

export default Counter;