import React from 'react';
import styles from "./button.module.scss";

const Button = ({children, handleClick}) => {
    return (
        <button className={styles.wrapper} onClick={handleClick}>
            {children}
        </button>
    );
};

export default Button;