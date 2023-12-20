"use client";

import Link from 'next/link';
import Style from './page.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

type TodoList = {
    id: number;
    text: string;
    done: boolean
}

const API_ENDPOINT = "http://localhost:5000/todos";


function Todo() {
    const [todos, setTodos] = useState<TodoList[]>([]);
    const [input, setInput] = useState<string>("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await axios.get(API_ENDPOINT);
                setTodos(res.data);
                setIsLoading(false);
            } catch (error:any) {
                setError(error);
                setIsLoading(false)
                
            }
        }
        fetchTodos();
    }, []);
    

    if (isLoading) {
        return <div className='flex justify-center items-center min-h-screen min-w-full'><div className='loading-lg loading bg-amber-600'></div></div>;
    }
    if(error) {
        return <div className='bg-error'>Error : {error}</div>
    }


    /**********Add TODO************/
    const addTodo = async (e:any) => {
        e.preventDefault();
        if (!input) return;
        // setTodos([...todos, { id: Date.now(), text: input, done: false }]); // add item like static way cote front
        // setInput("");

        //and this to add item to the db.json like in the API

        const res = await axios.post(
            API_ENDPOINT, 
            {text: input, done: false},
            {headers: {"Content-Type": "application/json"}}
        );
        const newTodo: TodoList = res.data;
        setTodos([...todos, newTodo]);
        setInput("");
        
        // try {
        //     const res = await axios.post(
        //         API_ENDPOINT, 
        //         {text: input, done: false},
        //         {headers: {"Content-Type": "application/json"}}
        //     );

        //     if (res.status === 200) {
        //         const newTodo: TodoList = res.data;
        //         setTodos([...todos, newTodo]);
        //         setInput("");
        //     } else {
        //         console.error("Failed to add todo");
        //     }
            
        // } catch (error) {
        //     console.error("Error adding todo:", error);
        // }
    };

    // This useEffect() it's just to show the console.log, like when the input isn't empty
    // useEffect(() => {
    //     if (!input)
    //         console.log('Todos list', todos)
    // }, [input]);

    const deleteTodo = async(id: number) => {
        // delete item like a static way
        //setTodos(todos.filter((todo) => todo.id !== id)); // filter() return list of the element searching,
                                                             // but find() return the element itself that we searching for 
                                                             // the astuce of delete, is to show all the element has not this id
        
        // it's to delete items from db.json like in the API
        try {
            const res = await axios.delete(`${API_ENDPOINT}/${id}`);
            if (res.status === 200) {
                setTodos(todos.filter((todo) => todo.id !== id) )
            }else {
                console.error("Failed to delete todo");
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
        
    };

    

    const markTodo = async (id: number) => {
        // update item like a static way
        /*setTodos(
            todos.map((todo) => 
                todo.id === id ? {...todo, done: !todo.done } : todo
            )
        );*/

        // the way of update in API
        try {
            const updateTodo = todos.map((todo) =>
                todo.id === id ? {...todo, done: !todo.done} : todo
            )
            const res = await axios.put(
                `${API_ENDPOINT}/${id}`,
                updateTodo.find((todo) => todo.id === id),
                { headers: { "Content-Type": "application/json" } }
            );
            if (res.status === 200) {
                setTodos(updateTodo);
            } else {
                console.error("Failed to update todo");
            }
        } catch (error) {
            console.error("Error update todo:", error);
        }
        
    };

    return (
        <>
            <div className="justify-center items-center flex min-h-screen flex-col w-1/2 m-auto">
                <h2 className={Style.h2}>Todo List Page</h2>
                <Link className="btn_custom mb-4" href="/">Go to Home</Link>

                <form onSubmit={addTodo} className="mb-5">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new todo"
                    className="input input-bordered border-spacing-0 mr-3"
                    />
                    <button type="submit" className="btn btn-success btn-sm">Add Todo</button>
                </form>
                <ul className="w-full p-4">
                    {todos.map((todo) => (
                        <li key={todo.id} className={`${Style.todoItem} mb-2 w-full flex justify-between ${todo.done ? Style.done : ""}`}>
                            <span className="cursor-pointer" onClick={() => markTodo(todo.id)}>{todo.text}</span>
                            {/* <button className={`${Style.button} ${Style.delete}`} onClick={() => deleteTodo(todo.id)}>
                                Delete
                            </button> */} {/* exemple with Module css two classes */}
                            <button className="btn btn-error btn-xs" onClick={() => deleteTodo(todo.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Todo;
