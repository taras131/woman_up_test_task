import React from "react";
import styles from "./task-card-main.module.scss";

/**
 * @description Компонент TaskCardMain рендерит основную часть карточки задачи и принимает следующие пропсы.
 *
 * - isEdit - boolean - при true включает режим редактирования задачи.
 * - handleInputChange - функция - обработчик события onChange для input.
 * - inputValues - объект - с вложенными значениями для input.
 * - title - string - заголовок задачи, в случаи, если компонент рендерит новую задачу,  - "".
 * - description - string - описание задачи, в случаи, если компонент рендерит новую задачу,  - "".
 */
const TaskCardMain = ({
                          isEdit,
                          handleInputChange,
                          inputValues,
                          title,
                          description,
                      }) => {
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