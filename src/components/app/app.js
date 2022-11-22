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

/**
 * @description Компонент App рендерит приложение и делает запрос на сервер для получения всех задач ,
 * после их получение устанавливает их в свой внутренний state tasks ,отслеживает новые данные от сервера и при их
 * приходе обновляет ыефеу.
 *
 */
const App = () => {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
            const q = query(collection(db, TASK_COLLECTION_NAME));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tasksArr = [];
                try{
                querySnapshot.forEach((doc) => {
                    tasksArr.push({...doc.data(), id: doc.id});
                });
                setTasks(tasksArr.sort((a, b) => b.timeCreation - a.timeCreation));
                } catch (e) {
                    alert(e)
                }
            });
            return () => unsubscribe();
    }, []);
    const taskList = tasks.map(item => (
        <li key={item.id}>
            <TaskCard {...item}/>
        </li>));
    return (
        <div className={styles.wrapper}>
            <h1>TODO</h1>
            <ul className={styles.task_section}>
                <li>
                    <TaskCard isNewTask={true}/>
                </li>
                {taskList}
            </ul>
        </div>
    );
};

export default App;
