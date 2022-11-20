import React, {useEffect, useRef, useState} from 'react';
import remove from "../../assets/icons/delete.png";
import save from "../../assets/icons/save.png";
import back from "../../assets/icons/back.png";
import edit from "../../assets/icons/edit.png";
import styles from "./task_card.module.scss";
import Button from "../button/button";
import {addDoc, collection} from "firebase/firestore";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {db, storage} from "../../config/firebase";
import classNames from "classnames";

const TaskCard = ({
                      id = null,
                      title = "",
                      description = "",
                      dateCompletion = "",
                      file = "",
                      isCompleted = "",
                      isNewTask = false,
                      toggleIsCompleted,
                      removeTask,
                      updateTask
                  }) => {
    const [isEdit, setIsEdit] = useState(isNewTask)
    const [inputFile, setInputFile] = useState("")
    const [inputValues, setInputValues] = useState({})
    const [url, setUrl] = useState('')
    const cardRef = useRef(null)
    const validateInputs = () => {
        if (inputValues.title !== ''
            && inputValues.description !== ''
            && inputValues.dateCompletion.length > 9) return true
        return false
    }
    const handleChangeFile = (e) => {
        setInputFile(e.target.files[0])
    }
    const handleInputChange = (e) => {
        setInputValues(
            {...inputValues, [e.target.name]: e.target.value}
        )
    }
    const toggleIsEdit = () => {
        setIsEdit(prev => !prev)
    }
    const handleDoubleClick = () => {
        if (!isNewTask) toggleIsEdit()
    }
    const handleClick = (e) => {
        //   e.preventDefault()
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
    const uploadFile = () => {
        const storageRef = ref(storage, inputFile.name);
        const uploadTask = uploadBytesResumable(storageRef, inputFile);
        uploadTask.on('state_changed',
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUrl(downloadURL)
                    console.log('вот же он ', downloadURL);
                });
            }
        );
        console.log(url)
    }

    const createNewTask = async () => {
        uploadFile()
        await addDoc(collection(db, 'tasks'), {
            title: inputValues.title,
            description: inputValues.description,
            dateCompletion: inputValues.dateCompletion,
            isCompleted: false,
        });
    };
    const handleSaveClick = async (e) => {
        e.preventDefault()
        if (!validateInputs()) return
        if (isNewTask) {
            await createNewTask()
        } else {
            await updateTask(id, {
                title: inputValues.title,
                description: inputValues.description,
                dateCompletion: inputValues.dateCompletion,
            })
            toggleIsEdit()
        }
    }
    useEffect(() => {
        if (isEdit) return
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])
    useEffect(() => {
        setInputValues({
            title: title,
            description: description,
            dateCompletion: dateCompletion,

        })
    }, [title, description, dateCompletion])
    return (
        <article ref={cardRef}
                 className={classNames(styles.wrapper, {
                     [styles.completed]: isCompleted
                 })}
                 onDoubleClick={handleDoubleClick}>
            <div className={styles.header}>
                {isEdit
                    ? (<>
                        <input className={styles.date_input}
                               onChange={handleInputChange}
                               name="dateCompletion"
                               type={"date"}
                               value={inputValues.dateCompletion}/>
                    </>)
                    : (<>
                        <p>{dateCompletion}</p>
                        <input type="checkbox"
                               onChange={() => toggleIsCompleted(id, isCompleted)}
                               checked={isCompleted}/>
                    </>)}
            </div>
            <div className={styles.main}>
                <div className={styles.title_block}>
                    {isEdit
                        ? (<input value={inputValues.title}
                                  onChange={handleInputChange}
                                  name={"title"}/>)
                        : (<h3>{title}</h3>)}
                </div>
                {isEdit
                    ? (<textarea value={inputValues.description} name="description" onChange={handleInputChange}/>)
                    : (<p>{description}</p>)}
            </div>
            <div className={styles.footer}>
                {isEdit
                    ? (<>
                        {!isNewTask && (
                            <Button handleClick={toggleIsEdit}>
                                <img src={back} alt="back"/>
                            </Button>)}
                        <input type="file" onChange={handleChangeFile}/>
                        <Button handleClick={handleSaveClick}>
                            <img src={save} alt="save"/>
                        </Button>
                    </>)
                    : (<>
                        <Button handleClick={() => removeTask(id)}>
                            <img src={remove} alt="remove"/>
                        </Button>
                        <div>file</div>
                        <Button handleClick={toggleIsEdit}>
                            <img src={edit} alt="edit"/>
                        </Button>
                    </>)}
            </div>
        </article>
    );
};

export default TaskCard;