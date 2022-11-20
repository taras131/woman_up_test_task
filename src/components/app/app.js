import styles from "./app.module.scss";
import TaskCard from "../task_card/task_card";
import {startTasks} from "../../face-data";
import {useState} from "react";

const App = () => {
 const[tasks, setTasks] = useState(startTasks)
    const taskList = tasks.map(item => (<TaskCard key={item.id} {...item}/>))
    return (
        <div className={styles.wrapper}>
            <h1>TODO</h1>
            <section className={styles.task_section}>
                {taskList}
            </section>
        </div>
    );
}

export default App;
