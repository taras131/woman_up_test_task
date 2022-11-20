import React from 'react';
import styles from "./task_card.module.scss";

const TaskCard = ({id, title, description, dateCompletion, file, status}) => {
    return (
        <article className={styles.wrapper}>
            <div className={styles.header}>
                <p>{id + 1}</p>
                <h3>{title}</h3>
                <p>{dateCompletion}</p>
            </div>
            <div className={styles.main}>
                <p>{description}</p>
            </div>
            <div className={styles.footer}>
                <div>delete</div>
                <div>file</div>
                <div>complete</div>
            </div>
        </article>
    );
};

export default TaskCard;