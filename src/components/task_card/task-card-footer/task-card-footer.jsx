import React from "react";
import Button from "../../button/button";
import styles from "./task-card-footer.module.scss";
import back from "../../../assets/icons/back.png";
import save from "../../../assets/icons/save.png";
import remove from "../../../assets/icons/delete.png";
import edit from "../../../assets/icons/edit.png";
import plus from "../../../assets/icons/plus.png";

/**
 * @description Компонент TaskCardFooter рендерит подвал карточки задачи и принимает следующие пропсы.
 *
 * - isEdit - boolean - при true включает режим редактирования задачи.
 * - isNewTask - boolean - если флаг true - компонент служит для создания новых задач.
 * - toggleIsEdit - функция - меняет значение флага режима редактирования isEdit на противоположное.
 * - handleChangeFile - функция - устанавливает выбранные файл в state компонента TaskCard.
 * - handleSave - функция - функция обрабатывающия событие клика по кнопке "сохранить".
 * - handleRemoveTask - функция - функция обрабатывающия событие клика по кнопке "удалить".
 * - fileName - string - имя прикреплённого файла, в случаи, если компонент рендерит новую задачу или файл
 * не прикреплён, - "".
 * - filePath - string - путь к прикреплённому файлу, в случаи, если компонент рендерит новую задачу или файл
 * не прикреплён, - "".
 * - isLoading - boolean - находится в состоянии true если идёт процесс загрузки.
 * - inputFile - выбраный пользователем файл, хранящийся в state компонента TaskCard.
 */
const TaskCardFooter = ({
                            isEdit,
                            isNewTask,
                            toggleIsEdit,
                            handleChangeFile,
                            handleSave,
                            handleRemoveTask,
                            fileName,
                            filePath,
                            isLoading,
                            inputFile,
                        }) => {
    return (
        <div className={styles.wrapper}>
            {isEdit && inputFile && (<div className={styles.file_name}>{inputFile.name.slice(0, 30)}</div>)}
            {isEdit
                ? (<>
                    {!isNewTask && (
                        <Button handleClick={toggleIsEdit}>
                            <img src={back} alt="back"/>
                        </Button>)}
                    <label className={styles.file_upload}>
                        <img src={plus} alt="plus"/>
                        <input type="file" onChange={handleChangeFile}/>
                    </label>
                    {isLoading
                        ? (<div>...</div>)
                        : (<Button handleClick={handleSave}>
                            <img src={save} alt="save"/>
                        </Button>)}
                </>)
                : (<>
                    <Button handleClick={handleRemoveTask}>
                        <img src={remove} alt="remove"/>
                    </Button>
                    {fileName && (
                        <a href={filePath}>{fileName.slice(13, 30)}</a>
                    )}
                    <Button handleClick={toggleIsEdit}>
                        <img src={edit} alt="edit"/>
                    </Button>
                </>)}
        </div>
    );
};

export default TaskCardFooter;