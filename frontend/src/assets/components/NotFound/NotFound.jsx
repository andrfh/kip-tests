import { Link } from "react-router-dom";
import Button from "../Button/Button";
import './NotFound.css'


const NotFound = ({error}) => {
    
    return (
        <div className="container">
            <h1>{error=='403' ? '403' : '404'}</h1>
            <h2>{error =='403'? 'Доступ запрещен' : 'Страницы не существует'}</h2>
            <p>{error == '403' ? 'У вас недостаточно прав для просмотра данной страницы' : 'Возможно, вы перешли по неверной ссылке или страница была удалена.'}</p>
            <Link to={{pathname: `/home`}}>
                <Button type='button' style='ghost' text='На главную'/>
            </Link>
        </div>
    );
}

export default NotFound;