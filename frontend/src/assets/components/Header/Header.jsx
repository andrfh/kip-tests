import logout from '../../../Images/logout.svg';
import '../Header/Header.css';
import { useEffect, useContext } from 'react';
import { UserContext } from '../Context/user.context.jsx';
import { Link } from 'react-router-dom';
import makaka from '../../../Images/bibizyana.png';

const Header = ({ day, month, text, subtitle, onLogout, isHome }) => {
  const { user, questions, open, setOpen, setDetailsOpen } = useContext(UserContext);

  useEffect(() => {
    setDetailsOpen(false);
  }, [open]);

  return (
    <>
      <header className='header'>
        <div className='header_items'>
          <div className='first_item'>
            <div className='header_items-date'>
              <h1>{day}</h1>
              <p>{month}</p>
            </div>
            <div className='header_items-title'>
              <h2>{isHome ? `Добрый день, ${user.first_name ? user.first_name : ''}!` : text}</h2>
              <p>
                {isHome && questions
                  ? `У вас ${questions} ${questions == 1 ? 'открытый билет' : questions < 5 ? 'открытых билета' : 'открытых билетов'}`
                  : subtitle}
              </p>
            </div>
          </div>
          <span className='btn'>
            <button className='header_items-logout' onClick={onLogout}>
              <p className='p'>Выйти</p>
              <img className='img' src={logout} alt='' />
            </button>
          </span>
        </div>
        <hr />
      </header>

      <header className='header_mobile'>
        <div className='header_mobile-items'>
          <div className='burger' onClick={() => setOpen(!open)}>
            <span className={open ? 'line open' : 'line'}></span>
            <span className={open ? 'line open' : 'line'}></span>
            <span className={open ? 'line open' : 'line'}></span>
          </div>
          <Link
            to={{
              pathname: `/profile/${user.username}`,
              state: user
            }}
          >
            <div className='sidebar_profile'>
              <div className='sidebar_info'>
                <p className='sidebar-name'>{user.last_name && user.first_name ? `${user.last_name} ${user.first_name[0]}.` : '...'}</p>
              </div>
              <img src={makaka} alt='' className='sidebar-icon' />
            </div>
          </Link>
        </div>

        <div className='header_navbar' style={{ top: open ? '80px' : '-220px', zIndex: open ? '99' : '-99' }}>
          <span className='sidebar-nav_source'>
            <a className='sidebar-nav_source-ghost' href='/home'>
              Главная
            </a>
          </span>

          {user.role === 'STUDENT' ? (
            <span className='sidebar-nav_source'>
              <a className='sidebar-nav_source-ghost' href='/history'>
                История билетов
              </a>
            </span>
          ) : (
            <>
              <span className='sidebar-nav_source'>
                <a className='sidebar-nav_source-ghost' href='/new_ticket'>
                  Новый билет
                </a>
              </span>
              <span className='sidebar-nav_source'>
                <a className='sidebar-nav_source-ghost' href='/result/table'>
                  Результаты
                </a>
              </span>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
