import './ContentWrapper.css'
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import itc from '../../../Images/itc.svg';
import tg from '../../../Images/tg.svg';
import vk from '../../../Images/vk.svg';


const ContentWrapper = ({children, text, subtitle, isHome, style}) => {
    const navigate = useNavigate()
    let isToken = localStorage.getItem('t')
    if (!isToken) {
        console.log(isToken)
        navigate('/')
    }

    const onLogout = () => {
        navigate('/')
        localStorage.clear();
    }
    
    
    let date = new Date
    const months = [
        "января", "февраля", "марта", "апреля", 
        "мая", "июня", "июля", "августа", 
        "сентября", "октября", "ноября", "декабря"
    ];
    
    return ( 
        <div className='main' style={style}>
            <div className="main-container">
                <Header day={date.getDate()} month={months[date.getMonth()]} text={text} subtitle={subtitle} onLogout={onLogout} isHome={isHome}/>
                {children}
                <footer className="footer">
                    <div className="sidebar_contacts">
                        <a href="https://itc-team.ru/"><img src={itc} alt=""/></a>
                        <p>Разработано Информационно-техническим сообществом</p>
                        <div className="contacts_links">
                            <a href="https://t.me/halfcoder"><img src={tg} alt="" className="contats_itc" />
                            </a>
                            <a href="https://vk.com/newsitc?from=groups"><img src={vk} alt="" className="contats_itc"/>
                            </a>
                        </div>
                    </div>
                        
                </footer>
            </div>
        </div>
     );
}
 
export default ContentWrapper;