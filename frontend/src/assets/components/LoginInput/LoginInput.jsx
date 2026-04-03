import styles from '../LoginInput/LoginInput.module.css'

const LoginInput = ({ label, type, onChange, name}) => {
    return ( 
        <div className={styles["loginInput"]}>
            <p className={styles["loginInput_label"]}>{label}</p>
            <input className={styles["loginInput_input"]} type={type} name={name} placeholder={label} onChange={onChange} autocomplete="on"/>
            {/* <span class={styles["loader"]}></span> */}
        </div>
     );
}
 
export default LoginInput;