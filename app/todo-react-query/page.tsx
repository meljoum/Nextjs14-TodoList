"use client";

import Link from 'next/link';
import Style from './page.module.css';
import { useState } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query';

type TodoList = {
    id: number;
    text: string;
    done: boolean
}

// This verstion i use it React Query 'npm install react-query'
// the features of use React-query is a powerfull library managing and caching asynchronous data in react
// don't need to use useEffect() function

const API_ENDPOINT = "http://localhost:5000/todos";

const queryClient = new QueryClient();

function Todo() {
    //const [todos, setTodos] = useState<TodoList[]>([]);
    const [input, setInput] = useState<string>("");

    const fetchTodos = async () => {
        const res = await axios.get(API_ENDPOINT);
        return res.data;
    };

    const {data: todoitem = [], isLoading, isError, refetch} = useQuery<TodoList[]>('data', fetchTodos)

    // ---------------------------------------
    //ADD TODO ===> Cote Client "Interface"
    // ---------------------------------------
    const addTodo = async (text: string) => {
        const res = await axios.post(API_ENDPOINT, {text, done: false});
        return res.data;
    };
    // ---------------------------------------
    //DELETE TODO ===> Cote Client "Interface"
    // ---------------------------------------
    const deleteTodo = async (id: number) => {
        await axios.delete(`${API_ENDPOINT}/${id}`);
    };
    // ---------------------------------------
    //UPDATE TODO ===> Cote Client "Interface"
    // ---------------------------------------
    const toggleTodo = async (id: number) => {
        const updateTodo = todoitem.map((todo) =>
            todo.id === id ? {...todo, done: !todo.done} : todo
        )
        const res = await axios.put(
            `${API_ENDPOINT}/${id}`,
            updateTodo.find((todo) => todo.id === id )
        );
        return res.data;
    };

    /*if (isLoading) {
        return <div className='flex justify-center items-center min-h-screen min-w-full'><div className='loading-lg loading bg-green-600'></div></div>;
    }
    if(isError) {
        return <div className='bg-error'>Error fetching data</div>
    }*/

    /************     Add Todo  |  Cote Server "base donnée"  **********/
    const addTodoMutation = useMutation(addTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todoitem");
            refetch();
        },
    })
    const handleAddTodo = async (e:any) => {
        e.preventDefault();
        if (!input) return;

        await addTodoMutation.mutateAsync(input);
        setInput("");
    }

    /**********     Delete Todo  |  Cote Server "base donnée"   *********/
    const deleteTodoMutation = useMutation(deleteTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todoitem");
            refetch();
        }
    })
    const handleDeleteMutation = async (id: number) => {
        await deleteTodoMutation.mutateAsync(id);                                           
    };

    /**********    Update Todo  |  Cote Server "base donnée"    *********/
    const toggleTodoMutation = useMutation(toggleTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todoitem");
            refetch();
        }
    })
    const handleToggleMutation = async (id: number) => {
        await toggleTodoMutation.mutateAsync(id);
    }
    /*********************************************************************/

    return (
        <>
            <div className="justify-center items-center flex min-h-screen flex-col w-1/2 m-auto">
                <h2 className={Style.h2}>Todo List Page</h2>
                <Link className="btn_custom mb-4" href="/">Go to Home</Link>

                <form onSubmit={handleAddTodo} className="mb-5">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new todo"
                    className="input input-bordered border-spacing-0 mr-3"
                    />
                    <button type="submit" className="btn btn-success btn-sm">Add Todo</button>
                </form>
                {isLoading ? (
                    <div className='flex justify-center items-center min-w-full'><div className='loading-lg loading bg-green-600'></div></div>
                ) : isError ? (
                    <div className='bg-error'>Error fetching data</div>
                ) : (
                    <ul className="w-full p-4">
                        {todoitem.map((todo) => (
                            <li key={todo.id} className={`${Style.todoItem} mb-2 w-full flex justify-between ${todo.done ? Style.done : ""}`}>
                                <span className="cursor-pointer" onClick={() => handleToggleMutation(todo.id)}>{todo.text}</span>
                                {/* <button className={`${Style.button} ${Style.delete}`} onClick={() => deleteTodo(todo.id)}>
                                    Delete
                                </button> */} {/* exemple with Module css two classes */}
                                <button className="btn btn-error btn-xs" onClick={() => handleDeleteMutation(todo.id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )
                }
                
            </div>
        </>
    )
}

const App = () => {
    return (
      <QueryClientProvider client={queryClient}>
            <Todo />
      </QueryClientProvider>
    );
};
  
export default App;
