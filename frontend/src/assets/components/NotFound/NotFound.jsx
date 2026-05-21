import { Link, useParams } from 'react-router-dom';
import Button from '../Button/Button';
import './NotFound.css';

const NotFound = ({ error }) => {
  const { code } = useParams();
  const status = error || code;
  const isForbidden = status === '403';

  return (
    <div className='container'>
      <h1>{isForbidden ? '403' : '404'}</h1>
      <h2>{isForbidden ? 'Доступ запрещен' : 'Страница не существует'}</h2>
      <p>
        {isForbidden
          ? 'У вас недостаточно прав для просмотра данной страницы.'
          : 'Возможно, вы перешли по неверной ссылке или страница была удалена.'}
      </p>
      <Link to={{ pathname: '/home' }}>
        <Button type='button' style='ghost' text='На главную' />
      </Link>
    </div>
  );
};

export default NotFound;
