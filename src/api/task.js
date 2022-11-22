import {
    deleteDoc,
    doc,
    updateDoc,
    addDoc,
    collection
} from "firebase/firestore";
import {ref, deleteObject, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {db, storage} from "../config/firebase";
import {TASK_COLLECTION_NAME} from "../utils/constants";


class ApiTask {
    removeFile = async (fileName) => {
        const desertRef = ref(storage, fileName);
        deleteObject(desertRef).then(() => {
            // File deleted successfully
        }).catch((e) => {
            alert(e)
        });
    }
    remove = async (id, fileName) => {
        try {
            await deleteDoc(doc(db, TASK_COLLECTION_NAME, id));
            if (fileName) await this.removeFile(fileName)
        } catch (e) {
            alert(e)
        }
    }
    toggleIsCompleted = async (id, newValue) => {
        try {
            await updateDoc(doc(db, TASK_COLLECTION_NAME, id), {
                isCompleted: newValue
            });
        } catch (e) {
            alert(e)
        }
    }
    create = async (inputValues, downloadURL = "", name = "") => {
        try {
            await addDoc(collection(db, TASK_COLLECTION_NAME), {
                title: inputValues.title,
                description: inputValues.description,
                dateCompletion: inputValues.dateCompletion,
                isCompleted: false,
                filePath: downloadURL,
                fileName: name,
                timeCreation: new Date().getTime()
            });
        } catch (e) {
            alert(e)
        }
    }
    update = async (id, inputValues, downloadURL = "", name = "") => {
        try {
            await updateDoc(doc(db, TASK_COLLECTION_NAME, id), {
                title: inputValues.title,
                description: inputValues.description,
                dateCompletion: inputValues.dateCompletion,
                isCompleted: false,
                filePath: downloadURL,
                fileName: name
            });
        } catch (e) {
            alert(e)
        }
    }
    uploadFile = async (id, inputFile, isNewTask, fileName, inputValues, setIsLoading) => {
        const name = new Date().getTime() + inputFile.name
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, inputFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                setIsLoading(true)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                alert("Ошибка загрузки")

                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                    default:
                        break;
                }
            },
            async () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    if (isNewTask) {
                        this.create(inputValues, downloadURL, name)
                    } else {
                        if (fileName) apiTask.removeFile(fileName)
                        this.update(id, inputValues, downloadURL, name)
                    }
                    setIsLoading(false)
                });
            }
        );
    }
}

const apiTask = new ApiTask();

export default apiTask;
