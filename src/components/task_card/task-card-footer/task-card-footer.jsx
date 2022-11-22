import React from 'react';
import Button from "../../button/button";
import styles from "./task-card-footer.module.scss";
import back from "../../../assets/icons/back.png";
import save from "../../../assets/icons/save.png";
import remove from "../../../assets/icons/delete.png";
import edit from "../../../assets/icons/edit.png";
import plus from "../../../assets/icons/plus.png";

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
                            inputFile
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