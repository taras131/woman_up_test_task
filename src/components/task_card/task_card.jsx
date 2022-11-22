import React, {useEffect, useRef, useState} from "react";
import TaskCardHeader from "./task-card-header/task-card-header";
import TaskCardMain from "./task-card-main/task-card-main";
import TaskCardFooter from "./task-card-footer/task-card-footer";
import styles from "./task_card.module.scss";
import classNames from "classnames";
import {validateInputs} from "../../utils/services";
import apiTask from "../../api/task";
import dayjs from "dayjs";
import {AFTER} from "../../utils/constants";

/**
 * @description Компонент TaskCard рендерит карточку задачи и принимает следующие пропсы.
 *
 * - id - string - id задачи, по умолчанию, в случаи, если компонент рендерит новую задачу,  - null.
 * - title - string - заголовок задачи, в случаи, если компонент рендерит новую задачу,  - "".
 * - description - string - описание задачи, в случаи, если компонент рендерит новую задачу,  - "".
 * - fileName - string - имя прикреплённого файла, в случаи, если компонент рендерит новую задачу или файл
 * не прикреплён, - "".
 * - filePath - string - путь к прикреплённому файлу, в случаи, если компонент рендерит новую задачу или файл
 * не прикреплён, - "".
 * - isCompleted - boolean - статус выполнения задачи.
 * - isNewTask - boolean - если флаг true - компонент служит для создания новых задач.
 */
const TaskCard = ({
                      id = null,
                      title = "",
                      description = "",
                      dateCompletion = "",
                      fileName = "",
                      filePath = "",
                      isCompleted = "",
                      isNewTask = false,
                  }) => {
    const [isEdit, setIsEdit] = useState(isNewTask);
    const [isLoading, setIsLoading] = useState(false);
    const [inputFile, setInputFile] = useState("");
    const [inputValues, setInputValues] = useState({});
    const [isValidationError, setIsValidationError] = useState(false);
    const [dateStatus, setDateStatus] = useState("");
    const cardRef = useRef(null);
    /**
     * Функция инициализирует внутренний state компонента значениями из пропсов
     */
    const setInitialState = () => {
        setInputFile("");
        setIsValidationError(false);
        setDateStatus("");
        setInputValues({
            title: title,
            description: description,
            dateCompletion: dateCompletion,
        });
    };
    /**
     * Функция устанавливает статус AFTER эсли дата выполнения задачи прошла
     */
    const calculationDateStatus = () => {
        const taskDate = dayjs(dateCompletion);
        const todayDate = dayjs();
        if (taskDate.isBefore(todayDate)) {
            setDateStatus(AFTER);
        } else {
            setDateStatus("");
        }
    };
    /**
     * Функция срабатывает при выборе пользователем файла и записывает его в state
     */
    const handleChangeFile = (e) => {
        setInputFile(e.target.files[0]);
    };
    /**
     * Функция обрабатывает события ввода в input
     */
    const handleInputChange = (e) => {
        setIsValidationError(false);
        setInputValues(
            {...inputValues, [e.target.name]: e.target.value}
        );
    };
    /**
     * Функция меняет значения isEdit на противоположное.
     */
    const toggleIsEdit = () => {
        if (!isNewTask) setIsEdit(prev => !prev);
    };
    /**
     * Функция срабатывает при клике на кнопку "удалить задачу", вызывая соответствующий метод в apiTask.
     */
    const handleRemoveTask = async () => {
        await apiTask.remove(id, fileName, filePath);
    };
    /**
     * Функция обрабатывает событие клика, и , если оно произошло не на карточке, отменяет режим редактирования задачи.
     * И сбрасывает введённые значение state setInputValues
     */
    const handleClick = (e) => {
        if (!cardRef.current) return;
        if (!cardRef.current.contains(e.target) && !isNewTask) {
            setInputValues({
                title: title,
                description: description,
                dateCompletion: dateCompletion,
            });
            setIsEdit(false);
        }
    };
    /**
     * Функция срабатывает при клике на чекбокс, отвечающий за значение статуса выполнения задачи и меняет его
     * значение на противоположное, вызывая соответствующий метод apiTask.
     */
    const toggleIsCompleted = async () => {
        await apiTask.toggleIsCompleted(id, !isCompleted);
    };
    /**
     * Функция срабатывает при клике на кнопку "сохранить" И в зависимости от того новая ли это задача и есть
     * ли вложенный файл, вызывает соответствующий метод apiTask.
     */
    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateInputs(inputValues)) {
            setIsValidationError(true);
            return;
        }
        setIsLoading(true);
        if (inputFile) {
            await apiTask.uploadFile(id, inputFile, isNewTask, fileName, inputValues, setIsLoading);
        } else {
            if (isNewTask) {
                await apiTask.create(inputValues);
            } else {
                await apiTask.update(id, inputValues, filePath, fileName);
            }
        }
        setIsLoading(false);
        setInitialState();
        setIsEdit(isNewTask);
    };
    /**
     * useEffect срабатывает после монтирования компонента, вешая на документ обработчик события "click" -  handleClick
     * и при демонтировании компонента удаляет его
     */
    useEffect(() => {
        if (isEdit) return;
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [handleClick]);
    /**
     * useEffect срабатывает после монтирования компонента и при изменения значений title, description, dateCompletion,
     * isEdit, isCompleted вызывает функции  setInitialState и calculationDateStatus, инициализирующие актуальными
     * значениями внутренний state компонента
     */
    useEffect(() => {
        setInitialState();
        calculationDateStatus();
    }, [title, description, dateCompletion, isEdit, isCompleted]);
    return (
        <article ref={cardRef}
                 className={classNames(styles.wrapper, {
                     [styles.edit]: isEdit,
                     [styles.after]: dateStatus === AFTER && !isCompleted,
                     [styles.completed]: isCompleted,
                     [styles.new]: isNewTask,
                 })}
                 onDoubleClick={toggleIsEdit}>
            <TaskCardHeader isEdit={isEdit}
                            handleInputChange={handleInputChange}
                            inputValues={inputValues}
                            dateCompletion={dateCompletion}
                            toggleIsCompleted={toggleIsCompleted}
                            isCompleted={isCompleted}
                            isValidationError={isValidationError}/>
            <TaskCardMain isEdit={isEdit}
                          inputValues={inputValues}
                          handleInputChange={handleInputChange}
                          title={title}
                          description={description}/>
            <TaskCardFooter isEdit={isEdit}
                            isNewTask={isNewTask}
                            toggleIsEdit={toggleIsEdit}
                            handleChangeFile={handleChangeFile}
                            handleSave={handleSave}
                            handleRemoveTask={handleRemoveTask}
                            fileName={fileName}
                            filePath={filePath}
                            isLoading={isLoading}
                            inputFile={inputFile}/>
        </article>
    );
};

export default TaskCard;