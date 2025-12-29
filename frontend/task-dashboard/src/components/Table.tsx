import {useState, useEffect,} from "react";


export default function Table(){

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data))
    }, [])
console.log(tasks)  
    return(
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Completed</th>
                    <th>Created On</th>
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
                        </tr>
                    ))}
                
            </tbody>
        </table>
    )
};