import {useState} from "react";

interface FormProps {
    onTaskCreated: () => void;
}


export default function Form({ onTaskCreated }: FormProps){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    const handleSubmit = (e:any) => {
        //prevent page reload
        e.preventDefault();

        //Post to backend to add a task
        console.log("Form submitted")
        console.log("Title:", title)
        console.log("Description:", description)
        if (title && description) {
        fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description })
        }).then(response => response.json())
          .then(data => {
              console.log("Task added:", data);
              setTitle("");
              setDescription("");
              onTaskCreated();
          })
          .catch(error => {
              console.error("Error adding task:", error);
          });
        }   
        
}
    return(
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Add Task</button>
        </form>
    )
}