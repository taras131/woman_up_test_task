import React from "react";
import styles from "./button.module.scss";

/**
 * @description Компонент кнопки.
 *
 * - children - содержимое кнопки.
 * - handleClick - функция - обработчик события click.
 */
const Button = ({children, handleClick}) => {
    return (
        <button className={styles.wrapper}
                onClick={handleClick}>
            {children}
        </button>
    );
};

export default Button;