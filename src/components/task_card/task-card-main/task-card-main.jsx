import React from 'react';
import styles from "./task-card-main.module.scss";

const TaskCardMain = ({isEdit, inputValues, handleInputChange, title, description}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title_block}>
                {isEdit
                    ? (<input value={inputValues.title}
                              onChange={handleInputChange}
                              name={"title"}
                              placeholder="Название задачи"/>)
                    : (<h3>{title}</h3>)}
            </div>
            {isEdit
                ? (<textarea value={inputValues.description}
                             name="description"
                             onChange={handleInputChange}
                             placeholder="Описание задачи"/>)
                : (<p>{description}</p>)}
        </div>
    );
};

export default TaskCardMain;