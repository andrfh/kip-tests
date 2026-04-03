import logout from '../../../Images/logout.svg'
import '../Header/Header.css'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { UserContext } from '../Context/user.context.jsx';
import logo from '../../../Images/logo_head.svg'
import { Link } from 'react-router-dom';
import makaka from '../../../Images/bibizyana.png'




const Header = ({day, month, text, subtitle, onLogout, isHome}) => {
    const { user, questions, open, setOpen, detailsOpen, setDetailsOpen } = useContext(UserContext)
    let userToken = JSON.parse(localStorage.getItem('t'))
    

    useEffect(() => {
        if (isHome) {
            axios.get(`${__API_ROOT__}/me`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => { 
                
            });
        }
      }, []);
    useEffect(() => {
        if (!open) {
            setDetailsOpen(false);
        }
    }, [open]);
    return ( 
        <>
        <header className="header">
            <div className="header_items">
                <div className="first_item">
                    <div className="header_items-date">
                        <h1>{day}</h1>
                        <p>{month}</p>
                    </div>
                    <div className="header_items-title">
                        <h2>{isHome ? `Добрый день, ${user.first_name ? user.first_name : ''}!` : text}</h2>
                        <p>{isHome && questions ? `У вас ${questions} ${questions == 1 ? 'открытый билет' : (questions < 5 ? 'октрытых билета' : 'открытых билетов')}` : subtitle}</p>
                    </div>
                </div>  
                <span className="btn">
                    <button className="header_items-logout" onClick={onLogout}>
                        <p className='p'>Выйти</p>
                        <img className='img' src={logout} alt="" />
                    </button>
                </span>
            </div>
            <hr />
        </header>
        <header className="header_mobile">
            <div className="header_mobile-items">
                <div className="burger" onClick={() => {setOpen(!open); setDetailsOpen(false)}}>
                    <span className={open ? 'line open' : 'line'}></span>
                    <span className={open ? 'line open' : 'line'}></span>
                    <span className={open ? 'line open' : 'line'}></span>
                </div>
                <Link to={{
                        pathname: `/profile/${user.username}`,
                        state: user
                    }}>
                        <div className="sidebar_profile">
                            <div className="sidebar_info">
                                <p className="sidebar-name">{user.last_name && user.first_name ? user.last_name + ' ' + user.first_name[0] + '.' : '...'}</p>
                            </div>
                            <img src={makaka} alt="" className="sidebar-icon" />

                        </div>
                    
                </Link> 
            </div>
            
            <div className="header_navbar" style={{top: open ? '80px' : '-180px', zIndex: open ? '99' : '-99'}}>
                <span className="sidebar-nav_source">
                    <a className="sidebar-nav_source-ghost" href="/home">Главная</a>
                </span>
                <span className="details">
                    <details open={detailsOpen} onToggle={(e) => {
                        setDetailsOpen(e.target.open);
                    }}>                        
                        <summary className="tree-nav__item-title">Билеты</summary>
                        <div className="details_content">
                            <div className="details-content_wrapper">
                                {(user.role == "STUDENT") ? 
                                <>
                                    <span className="details_btn">
                                        <a className="details_btn-ghost" href="/tickets">Все билеты</a>
                                    </span>
                                    <span className="details_btn">
                                        <a className="details_btn-ghost" href="/exam">Экзамены</a>
                                    </span>
                                    <span className="details_btn">
                                        <a className="details_btn-ghost" href="/history">История билетов</a>
                                    </span>
                                </> : <>
                                    <span className="details_btn">
                                        <a className="details_btn-ghost" href="/tickets">Мои билеты</a>
                                    </span>
                                    <span className="details_btn">
                                        <a className="details_btn-ghost" href="/new_ticket">Новый билет</a>
                                    </span>
                                    <span className="details_btn">
                                        <a className="details_btn-ghost" href="/result/table">Результаты</a>
                                    </span>
                                </>
                                
                                }
                                
                            </div>  
                        </div>
                        
                    </details>
                </span>
                <span className="sidebar-nav_source">
                    <a className="sidebar-nav_source-ghost" href="/contacts">Контакты</a>
                </span>
            </div>
        </header>
        </>
        
     );
}
 
export default Header;