import { NavLink } from 'react-router-dom';
import './ButtonLink.css'

const ButtonLink = ({ style, text, href }) => {
    return ( 
        <NavLink className={style} to={href}>{text}</NavLink>
     );
}
 
export default ButtonLink;