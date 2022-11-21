import React, {useEffect, useRef, useState} from 'react';
import TaskCardHeader from "./task-card-header/task-card-header";
import TaskCardMain from "./task-card-main/task-card-main";
import TaskCardFooter from "./task-card-footer/task-card-footer";
import styles from "./task_card.module.scss";
import classNames from "classnames";
import {validateInputs} from "../../utils/services";
import apiTask from "../../api/task";
import dayjs from "dayjs";
import {AFTER} from "../../utils/constants";

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
    const [isEdit, setIsEdit] = useState(isNewTask)
    const [isLoading, setIsLoading] = useState(false)
    const [inputFile, setInputFile] = useState("")
    const [inputValues, setInputValues] = useState({})
    const [isValidationError, setIsValidationError] = useState(false)
    const [dateStatus, setDateStatus] = useState("")
    const cardRef = useRef(null)
    const setInitialState = () => {
        setInputFile("")
        setIsValidationError(false)
        setDateStatus("")
        setInputValues({
            title: title,
            description: description,
            dateCompletion: dateCompletion,
        })
    }
    /**
     * Функция определяет истекло ли время для выполнения задач
     */
    const calculationDateStatus = () => {
        const taskDate = dayjs(dateCompletion);
        const todayDate = dayjs();
        if (taskDate.isBefore(todayDate)) setDateStatus(AFTER)
    }
    const handleChangeFile = (e) => {
        setInputFile(e.target.files[0])
    }
    const handleInputChange = (e) => {
        setIsValidationError(false)
        setInputValues(
            {...inputValues, [e.target.name]: e.target.value}
        )
    }
    const toggleIsEdit = () => {
        if (!isNewTask) setIsEdit(prev => !prev)
    }
    const handleRemoveTask = async () => {
        await apiTask.remove(id, fileName, filePath)
    };
    const handleClick = (e) => {
        if (!cardRef.current) return
        if (!cardRef.current.contains(e.target) && !isNewTask) {
            setInputValues({
                title: title,
                description: description,
                dateCompletion: dateCompletion,
            })
            setIsEdit(false);
        }
    }
    const toggleIsCompleted = async () => {
        await apiTask.toggleIsCompleted(id, !isCompleted)
    };
    const handleSave = async (e) => {
        e.preventDefault()
        if (!validateInputs(inputValues)) {
            setIsValidationError(true)
            return
        }
        setIsLoading(true)
        if (inputFile) {
            await apiTask.uploadFile(id, inputFile, isNewTask, fileName, inputValues, setIsLoading)
        } else {
            if (isNewTask) {
                await apiTask.create(inputValues)
            } else {
                await apiTask.update(id, inputValues)
            }
        }
        setIsLoading(false)
        setInitialState()
    }
    useEffect(() => {
        if (isEdit) return
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])
    useEffect(() => {
        setInitialState()
        calculationDateStatus()
    }, [title, description, dateCompletion, isEdit, isCompleted])
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