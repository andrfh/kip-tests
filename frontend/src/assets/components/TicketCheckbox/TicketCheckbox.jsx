import styles from '../TicketCheckbox/TicketCheckbox.module.css'
import { useState } from 'react';

const Checkbox = ({name, onChange, value}) => {


    return ( 
        <div className={styles["input_checkbox"]}>
            <h2 className={styles["input_label"]}>Статус билета</h2>
            {/* <label className={styles["toggle"]}>
                <input type="checkbox" 
                value={value}
                name={name}
                onChange={onChange} />
                <span className={styles["slider"]}></span>
                <span className={styles["labels"]} data-on="Открыт" data-off="Закрыт"></span>
            </label> */}
            <div className={styles["button"]} id={styles["button-10"]} >
                <input type="checkbox" 
                value={value}
                name={name}
                onChange={onChange} className={styles["checkbox"]}/>
                <div className={styles["knobs"]}>
                    <span>Закрыт</span>
                </div>
                <div className={styles["layer"]}></div>
            </div>
        </div>
        
     );
}
 
export default Checkbox;