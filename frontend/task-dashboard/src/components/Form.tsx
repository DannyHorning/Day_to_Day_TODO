import {useState} from "react";



export default function Form(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    const handleSubmit = () => {
        console.log("Form submitted")
        if (title && description) {
        
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