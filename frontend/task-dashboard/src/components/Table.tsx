import {useState, useEffect,} from "react";
import Form from "./Form.tsx";


export default function Table(){

    const [tasks, setTasks] = useState([])
    

    const fetchTasks = async () => {
        const res = await fetch("http://localhost:3000/tasks");
        const data = await res.json()
        setTasks(data)
        console.log("Fetched tasks:", data);

    }
    

    const editTasks = (id: number) => {
    console.log("Edit button clicked for task with ID:", id);
    const fetchTask = async () => {
        const res = await fetch(`http://localhost:3000/tasks/${id}`);
        const data = await res.json()
        console.log("Fetched task for editing:", data);}
    fetchTask();

    }

    useEffect(() => {
        fetchTasks();
    }, []);

console.log(tasks)  
    return(
        <>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Completed</th>
                    <th>Created On</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>            
            <tbody>
            
                    {tasks.map((task: any) => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.completed ? "Yes" : "No"}</td>
                            <td>{new Date(task.created_at).toLocaleDateString()}</td>
                            <td><button onClick={() => editTasks(task.id)}>Edit</button></td>
                            <td><input type="checkbox" /></td>
                            
                        </tr>
                    
                
                    ))}
                <tr>
                    <td colSpan={7}><button>Save</button></td>
                </tr>
            </tbody>
            
        </table>
        <Form onTaskCreated={fetchTasks} />
        </>
    )
};