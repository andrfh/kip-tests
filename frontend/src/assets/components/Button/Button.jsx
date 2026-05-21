import '../Button/Button.css'

const Button = ({ style, text, onClick, type, disabled}) => {
    return ( 
        <span className="ticket_btn">
            <button type={type} className={style} onClick={onClick} disabled={disabled}>{text}</button>
        </span>
     );
}
 
export default Button;