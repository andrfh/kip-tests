import styles from '../LeftPanel/LeftPanel.module.css';
import makaka from '../../../Images/bibizyana.png';
import { UserContext } from '../Context/user.context';
import { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import ProgressBar from '../ProgressBar/ProgressBar';
import api from '../../../api/axios';

const LeftPanel = ({ isTest }) => {
  const navigate = useNavigate();
  const { attempt_id } = useParams();
  const [ticket, setTicket] = useState();
  const { user, setUser, attemptInfo } = useContext(UserContext);

  useEffect(() => {
    if (isTest) {
      api.get(`/attempts/${attempt_id}`).then((resp) => {
        setTicket(resp.data);
      }).catch(() => {
        navigate('/error/404');
      });
    }
  }, []);

  const sendAsnwers = () => {
    api
      .post(`/attempts/${attempt_id}/submit/`, attemptInfo.answers)
      .then((response) => {
        if (response.request.status.toString()[0] === '2') {
          navigate('/home');
          localStorage.removeItem('answers');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <aside className={styles['sidebar']}>
      <Link
        to={{
          pathname: `/profile/${user.username}`,
          state: user
        }}
      >
        <div className={styles['sidebar_profile']}>
          <img src={makaka} alt='' className={styles['sidebar-icon']} />
          <div className={styles['sidebar_info']}>
            <p className={styles['sidebar-name']}>
              {user.last_name && user.first_name ? `${user.last_name} ${user.first_name[0]}.` : '...'}
            </p>
            <p className={styles['sidebar-role']}>{user.role === 'STUDENT' ? 'Студент' : 'Преподаватель'}</p>
          </div>
        </div>
      </Link>

      <div className={styles['sidebar-nav']}>
        <h2>Навигация</h2>
        <div className={styles['sidebar_nav-btns']}>
          {!isTest ? (
            <>
              <span className={styles['sidebar-nav_source']}>
                <a className={styles['sidebar-nav_source-ghost']} href='/home'>
                  Главная
                </a>
              </span>

              {user.role === 'STUDENT' ? (
                <>
                <span className={styles['sidebar-nav_source']}>
                  <a className={styles['sidebar-nav_source-ghost']} href='/tickets'>
                    Все билеты
                  </a>
                </span>
                <span className={styles['sidebar-nav_source']}>
                  <a className={styles['sidebar-nav_source-ghost']} href='/history'>
                    История
                  </a>
                </span>
                </>
              ) : (
                <>
                  <span className={styles['sidebar-nav_source']}>
                    <a className={styles['sidebar-nav_source-ghost']} href='/new_ticket'>
                      Новый билет
                    </a>
                  </span>
                  <span className={styles['sidebar-nav_source']}>
                    <a className={styles['sidebar-nav_source-ghost']} href='/result/table'>
                      Результаты
                    </a>
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              {ticket && attemptInfo && (
                <div className={styles['sidebar_test']}>
                  <p className={styles['sidebar_test-text']}>Оставшееся время:</p>
                  <ProgressBar
                    totalDuration={ticket.ticket.time_limit_seconds}
                    initialRemaining={attemptInfo.seconds}
                    endTime={sendAsnwers}
                  />
                  <h2 className={styles['sidebar_test-question']}>Вопрос {attemptInfo.question_id + 1}</h2>
                  <p className={styles['sidebar_test-score']}>Баллов {attemptInfo.points}</p>
                  <Button
                    type='button'
                    style='warning'
                    text='Завершить'
                    onClick={() => {
                      const confirmed = window.confirm('Вы уверены, что хотите завершить?');
                      if (confirmed) {
                        sendAsnwers();
                      }
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LeftPanel;
