import TaskCard from "../task_card/task_card";
import {useEffect, useState} from "react";
import styles from "./app.module.scss";
import {db} from "../../config/firebase";
import {
    query,
    collection,
    onSnapshot,
} from "firebase/firestore";
import {TASK_COLLECTION_NAME} from "../../utils/constants";

const App = () => {
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        const q = query(collection(db, TASK_COLLECTION_NAME));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let tasksArr = [];
            querySnapshot.forEach((doc) => {
                tasksArr.push({...doc.data(), id: doc.id});
            });
            setTasks(tasksArr.sort((a, b) => b.timeCreation - a.timeCreation));
        });
        return () => unsubscribe();
    }, [])
    const taskList = tasks.map(item => (<TaskCard key={item.id} {...item}/>))
    return (
        <div className={styles.wrapper}>
            <h1>TODO</h1>
            <section className={styles.task_section}>
                <TaskCard isNewTask={true}/>
                {taskList}
            </section>
        </div>
    );
}

export default App;
