import {useState, useEffect,} from "react";
import Form from "./Form.tsx";

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
}

export default function Table(){

    const [tasks, setTasks] = useState<Task[]>([])
    const [task, setTask] = useState({
        id: "0",
        title: "",
        description: "",
        completed: false,
        created_at: ""
    })
    const [editWindow, setEditWindow] = useState(false)
    const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
    const [changeCompleted, setChangeCompleted] = useState<number[]>([]);
    

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
    const data = await res.json();
    setTask(data);
    setEditWindow(true);
  };
  fetchTask();
};

    const handleEditSubmit = (e:any) => {  
        e.preventDefault();
        const updateTask = async () => {
            const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            });
            if (res.ok) {
                fetchTasks();
                setEditWindow(false);
            } else {
                console.error("Failed to update task");
            }
        };
        updateTask();
    };

    const handleTableSave = async (e: any) => {
  e.preventDefault();
  console.log("Table save clicked");

  try {
    // Batch delete
    await Promise.all(
      checkedTasks.map((id) =>
        fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
      )
    );

    // Batch complete
    await Promise.all(
    changeCompleted.map((id) => {
    const fullTask = tasks.find((t) => t.id === id);
    if (!fullTask) return Promise.resolve();

    return fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: fullTask.completed }), // <- send current value
    });
  })
);

    // Refresh list once
    await fetchTasks();
    setCheckedTasks([]);
    setChangeCompleted([]);
  } catch (error) {
    console.error("Error during table save:", error);
  }
};

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
                            <td><input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;

                                        // 1. Update the completion state for this task immediately
                                        setTasks((prevTasks) =>
                                        prevTasks.map((t) =>
                                            t.id === task.id ? { ...t, completed: isChecked } : t
                                        )
                                        );

                                        // 2. Track this task as changed (add/remove from changeCompleted)
                                        setChangeCompleted((prev) =>
                                        prev.includes(task.id)
                                            ? prev.filter((id) => id !== task.id)
                                            : [...prev, task.id]
                                        );
                                    }}
                                    /></td>
                            <td>{new Date(task.created_at).toLocaleDateString()}</td>
                            <td><button onClick={() => editTasks(task.id)}>Edit</button></td>
                            <td><input type="checkbox" onChange ={()=>{setCheckedTasks([...checkedTasks, task.id])}} /></td>
                            
                        </tr>
                    
                
                    ))}
                <tr>
                    <td colSpan={7}><button onClick ={(e)=>{handleTableSave(e)}}>Save</button></td>
                </tr>
            </tbody>
            
        </table>
        {editWindow && (<form>
            <input type="text" value={task.id} disabled />
            <input type="text" value={task.title} onChange = {(e) => setTask({...task, title: e.target.value})}/>
            <input type="text" value={task.description} onChange = {(e) => setTask({...task, description: e.target.value})}/>
            <button type="submit" onClick={(e) => handleEditSubmit(e)}>Save</button>
        </form>)}
        <Form onTaskCreated={fetchTasks} />
        </>
    )
};