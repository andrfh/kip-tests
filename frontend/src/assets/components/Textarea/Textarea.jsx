import styles from '../Textarea/Textarea.module.css'

const Textarea = ({maxlength, text, name, onChange, value, style, ref}) => {
    return ( 
        <div className={styles['textarea']}>
            <textarea className={styles['textarea-textarea'] + `${style}`} maxLength={maxlength} ref={ref} onChange={onChange} name={name} id="" cols="30" rows="10" value={value} />
            <p className={styles["textarea-text"]}>Максимум 100 символов</p>
        </div>
        
     );
}
 
export default Textarea;