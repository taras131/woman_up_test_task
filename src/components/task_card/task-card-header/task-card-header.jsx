import React from "react";
import styles from "./task-card-header.module.scss";

/**
 * @description Компонент TaskCardHeader рендерит заголовок карточки задачи и принимает следующие пропсы.
 *
 * - isEdit - boolean - при true включает режим редактирования задачи.
 * - handleInputChange - функция - обработчик события onChange для input.
 * - inputValues - объект - с вложенными значениями для input.
 * - dateCompletion - string - дата до которой задача должна быть выполнена.
 * - toggleIsCompleted - функция - изменяет флага выполнения задачи isCompleted на противоположное.
 * - isCompleted - boolean - статус выполнения задачи.
 * - isValidationError - string - значение ошибки валидации полей ввода, по умолчанию, - "".
 */
const TaskCardHeader = ({
                            isEdit,
                            handleInputChange,
                            inputValues,
                            dateCompletion,
                            toggleIsCompleted,
                            isCompleted,
                            isValidationError,
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