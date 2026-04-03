import styles from '../Input/Input.module.css'

const Input = ({maxlength, label, type, text, name, onChange, value, style, ref, defaultValue, width }) => {
    return ( 
        <div className={styles["input"]}>
            {(label != 'none' ) ? <h2 className={styles["input_label"]}>{label}</h2> : <></>}
            <input autocomplete="off" className={styles["input_input"] + `${style}`} maxLength={maxlength} ref={ref} type={type} name={name} placeholder={text} onChange={onChange} value={value} defaultValue={defaultValue} style={{width: width}}/>
        </div>
     );
}
 
export default Input;