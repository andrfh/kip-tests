import Button from '../Button/Button';
import logo from '../../../Images/LogoHome.svg'
import landing from '../../../Images/landing.png'
import { Link } from 'react-router-dom';

const Landing = () => {
    return ( 
        <div className="login">
            <div className="home_header">
                    <img src={logo} alt="" />
                    <Link to='/tickets'><Button style='primary' text='Посмотреть все'/></Link>
                </div>
                <h2>Современное решение для контроля знаний студентов</h2>
                <div className="home_content">
                    <p>Платформа "КИПЗАЧЁТ" позволяет преподавателям легко создавать билеты, а студентам - удобно проходить их в онлайн-формате</p>
                    <img src={landing} alt="" />
                </div>
                <h2>Преимущетсва</h2>
                <div className="home_advantages">
                    <div className="adv_block">
                        <img src="" alt="" />
                        <h3>Удобство пользования</h3>
                        <p>Интуитивно понятный интерфейс для преподавателей и студентов</p>
                    </div>
                    <div className="adv_block">
                        <img src="" alt="" />
                        <h3>Гибкость настройки</h3>
                        <p>Создание билетов с учетом различных типов вопросов и тем</p>
                    </div>
                </div>
                <div className="home_advantages">
                    <div className="adv_block">
                        <img src="" alt="" />
                        <h3>Автоматизация процесса</h3>
                        <p>Автоматическая проверка ответов и подсчет результатов</p>
                    </div>
                    <div className="adv_block">
                        <img src="" alt="" />
                        <h3>Безопасность и надёжность</h3>
                        <p>Защита данных и стабильная работа системы</p>
                    </div>
                </div>

        </div>
     );
}
 
export default Landing;