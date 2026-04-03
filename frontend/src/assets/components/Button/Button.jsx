import '../Button/Button.css'

const Button = ({ style, text, onClick, type}) => {
    return ( 
        <span className="ticket_btn">
            <button type={type} className={style} onClick={onClick} >{text}</button>
        </span>
     );
}
 
export default Button;