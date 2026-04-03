import React, { useState } from 'react';
import styles from '../TimeInput/TimeInput.module.css'

const TimeInput = ({ name, formatTime, onTimeChange, value}) => {
    const [time, setTime] = useState("");
    
    
    
    const handleChange = (event) => {
        const value = event.target.value;
        setTime(formatTime(value));
    };
    
    const handleBlur = () => {
        const parts = time.split(":").map(num => num.padStart(2, '0'));
        while (parts.length < 3) parts.unshift("00");
        const formattedTime = parts.join(":");
        setTime(formattedTime);
        onTimeChange(formattedTime);
    };
    
    return (
        <div className={styles["input"]}>
            <h2 className={styles["input_label"]}>Время прохождения</h2>
            <input 
                className={styles['timeInput']}
                type="text" 
                name={name}
                value={value} 
                onChange={onTimeChange} 
                placeholder="чч:мм:сс" 
                maxLength={8} 
            />
        </div>
    );
};

export default TimeInput;