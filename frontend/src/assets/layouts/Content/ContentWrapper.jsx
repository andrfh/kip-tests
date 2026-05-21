import './ContentWrapper.css';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../components/Context/user.context';

const ContentWrapper = ({ children, text, subtitle, isHome, style }) => {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  const date = new Date();
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ];

  return (
    <div className='main' style={style}>
      <div className='main-container'>
        <Header day={date.getDate()} month={months[date.getMonth()]} text={text} subtitle={subtitle} onLogout={onLogout} isHome={isHome} />
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;
