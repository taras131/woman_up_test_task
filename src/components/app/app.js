import styles from "./app.module.scss";
import TaskCard from "../task_card/task_card";
import {startTasks} from "../../face-data";
import {useEffect, useState} from "react";
import {db} from "../../config/firebase";
import {
    query,
    collection,
    onSnapshot,
    updateDoc,
    doc,
    deleteDoc,
} from 'firebase/firestore';

const App = () => {
    const [tasks, setTasks] = useState(startTasks)

    useEffect(() => {
        const q = query(collection(db, 'tasks'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let tasksArr = [];
            querySnapshot.forEach((doc) => {
                tasksArr.push({...doc.data(), id: doc.id});
            });
            setTasks(tasksArr);
        });
        return () => unsubscribe();
    }, [])

    const toggleIsCompleted = async (id, isCompleted) => {
        await updateDoc(doc(db, 'tasks', id), {
            isCompleted: !isCompleted
        });
    };

    const removeTask = async (id) => {
        await deleteDoc(doc(db, 'tasks', id));
    };

    const updateTask= async (id, task) => {
        await updateDoc(doc(db, 'tasks', id), task);
    };

    const taskList = tasks.map((item, index) => (<TaskCard key={item.id}
                                                           {...item}
                                                           toggleIsCompleted={toggleIsCompleted}
                                                           index={index}
                                                           removeTask={removeTask}
                                                           updateTask={updateTask}/>))
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
