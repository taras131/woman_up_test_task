import React from 'react';
import styles from "./task-card-header.module.scss";

const TaskCardHeader = ({
                            isEdit,
                            handleInputChange,
                            inputValues,
                            dateCompletion,
                            toggleIsCompleted,
                            isCompleted,
                            isValidationError
                        }) => {
    return (
        <div className={styles.wrapper}>
            {isEdit
                ? (<>
                    <input className={styles.date_input}
                           onChange={handleInputChange}
                           name="dateCompletion"
                           type={"date"}
                           value={inputValues.dateCompletion}/>
                    {isValidationError && (<p className={styles.warning}>Проверьте поля</p>)}
                </>)
                : (<>
                    <p>{dateCompletion}</p>
                    <input type="checkbox"
                           onChange={toggleIsCompleted}
                           checked={isCompleted}
                           id="checkbox"/>
                </>)}
        </div>
    );
};

export default TaskCardHeader;