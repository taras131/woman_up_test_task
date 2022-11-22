import {
    deleteDoc,
    doc,
    updateDoc,
    addDoc,
    collection,
} from "firebase/firestore";
import {ref, deleteObject, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {db, storage} from "../config/firebase";
import {TASK_COLLECTION_NAME} from "../utils/constants";


class ApiTask {
    /**
     * @description Метод removeFile делает запрос на сервер для удаления файла, принимает:
     *
     * - fileName - string - имя удаляемого файла.
     */
    removeFile = async (fileName) => {
        const desertRef = ref(storage, fileName);
        deleteObject(desertRef).then(() => {
            // File deleted successfully
        }).catch((e) => {
            alert(e);
        });
    };
    /**
     * @description Метод remove делает запрос на сервер для удаления задачи, и связанного с ней файла, если он
     * есть принимает:
     *
     * - id - string - id задачи.
     * - fileName - string - имя удаляемого файла, если оно есть и "" если его нет.
     */
    remove = async (id, fileName) => {
        try {
            await deleteDoc(doc(db, TASK_COLLECTION_NAME, id));
            if (fileName) await this.removeFile(fileName);
        } catch (e) {
            alert(e);
        }
    };
    /**
     * @description Метод toggleIsCompleted делает запрос на сервер для изменения статуса isCompleted задачи,
     * принимает:
     *
     * - id - string - id задачи.
     * - newValue - boolean - новое значения для поля isCompleted.
     */
    toggleIsCompleted = async (id, newValue) => {
        try {
            await updateDoc(doc(db, TASK_COLLECTION_NAME, id), {
                isCompleted: newValue,
            });
        } catch (e) {
            alert(e);
        }
    };
    /**
     * @description Метод create делает запрос на сервер для создания новой задачи,
     * принимает:
     *
     * - inputValues - объект - сожержащий текстовые поля title, description, dateCompletion.
     * - downloadURL - string - путь к связанному файлу, если файла нет , то значение "".
     * - fileName - string - имя связанного файла, если файла нет , то значение "".
     */
    create = async (inputValues, downloadURL = "", fileName = "") => {
        try {
            await addDoc(collection(db, TASK_COLLECTION_NAME), {
                title: inputValues.title,
                description: inputValues.description,
                dateCompletion: inputValues.dateCompletion,
                isCompleted: false,
                filePath: downloadURL,
                fileName: fileName,
                timeCreation: new Date().getTime(),
            });
        } catch (e) {
            alert(e);
        }
    };
    /**
     * @description Метод update делает запрос на сервер для обновления полей задачи,
     * принимает:
     *
     * - id - string - id задачи.
     * - inputValues - объект - сожержащий текстовые поля title, description, dateCompletion.
     * - downloadURL - string - путь к связанному файлу, если файла нет , то значение "".
     * - fileName - string - имя связанного файла, если файла нет , то значение "".
     */
    update = async (id, inputValues, downloadURL = "", name = "") => {
        try {
            await updateDoc(doc(db, TASK_COLLECTION_NAME, id), {
                title: inputValues.title,
                description: inputValues.description,
                dateCompletion: inputValues.dateCompletion,
                isCompleted: false,
                filePath: downloadURL,
                fileName: name,
            });
        } catch (e) {
            alert(e);
        }
    };
    /**
     * @description Метод uploadFile делает запрос на сервер для загрузки файла и последующего вызова метода создание
     * или обновления задачи в зависимости от флага isNewTask,при обновлении существующей задачи и наличия в ней
     * старого файла, он удаляется
     * принимает:
     *
     * - id - string - id задачи.
     * - inputFile - file - новый, загруженный пользователем файл.
     * - isNewTask - boolean - в значении true , если создаётся новая задача.
     * - fileName - string - имя уже связанного с задачей файла, если файла нет , то значение "".
     * - inputValues - объект - сожержащий текстовые поля title, description, dateCompletion.
     * - setIsLoading - функция - устанавливает в state компонента значения isLoading.
     */
    uploadFile = async (id, inputFile, isNewTask, fileName, inputValues, setIsLoading) => {
        const name = new Date().getTime() + inputFile.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, inputFile);
        uploadTask.on("state_changed",
            (snapshot) => {
                setIsLoading(true);
                switch (snapshot.state) {
                    case "paused":
                        break;
                    case "running":
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                alert("Ошибка загрузки");
                switch (error.code) {
                    case "storage/unauthorized":
                        break;
                    case "storage/canceled":
                        break;
                    case "storage/unknown":
                        break;
                    default:
                        break;
                }
            },
            async () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    if (isNewTask) {
                        this.create(inputValues, downloadURL, name);
                    } else {
                        if (fileName) apiTask.removeFile(fileName);
                        this.update(id, inputValues, downloadURL, name);
                    }
                    setIsLoading(false);
                });
            }
        );
    };
}

const apiTask = new ApiTask();

export default apiTask;
