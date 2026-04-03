import styles from '../LeftPanel/LeftPanel.module.css';
import logo from '../../../Images/Logo.svg'
import itc from '../../../Images/itc.svg'
import tg from '../../../Images/tg.svg'
import vk from '../../../Images/vk.svg'
import makaka from '../../../Images/bibizyana.png'
import { UserContext } from '../Context/user.context';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import ProgressBar from '../ProgressBar/ProgressBar';
import axios from 'axios';


const LeftPanel = ({isTest}) => {
    const navigate = useNavigate();

    const {attempt_id} = useParams() 
    const [ticket, setTicket] = useState() 
    const { user, setUser, attemptInfo, setAttemptInfo } = useContext(UserContext)
    let userToken = JSON.parse(localStorage.getItem('t'))
    
    useEffect(() => {
        if (isTest) {
            axios.get(`${__API_ROOT__}/attempts/${attempt_id}`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => { 
                setTicket(resp.data);
                
            });
        }
        axios.get(`${__API_ROOT__}/me`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => { 
            setUser({
                id: resp.data.id,
                username: resp.data.username,
                first_name: resp.data.first_name,
                last_name: resp.data.last_name,
                surname: resp.data.surname,
                role: resp.data.role,
                group: resp.data.role == 'STUDENT' ? resp.data?.study_group.name : ''
            })
        })
	.catch((error) => {
		navigate("/")
	});
        }, []);
    
    const sendAsnwers = () => {
         axios
          .post(`${__API_ROOT__}/attempts/${attempt_id}/submit/`, attemptInfo.answers, {headers: { Authorization: `Token ${userToken}`}})
          .then((response) => {
            if (response.request.status.toString()[0] == 2) {
                navigate("/home");
                localStorage.removeItem('answers')
                stopTimer()
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error('Не удалось отправить ответы. Ошибка ' + error.response.status)
          });
    }
    
    
    return (
        // <UserContext.Consumer>
        //     {(context) => {
                
                <aside className={styles["sidebar"]}>
                    {/* <a href="/">
                        <img className={styles['sidebar-logo']} src={logo} alt='logo'/>
                    </a> */}
                    <Link to={{
                            pathname: `/profile/${user.username}`,
                            state: user
                        }}>
                            <div className={styles["sidebar_profile"]}>
                                <img src={makaka} alt="" className={styles["sidebar-icon"]} />
                                <div className={styles["sidebar_info"]}>
                                    <p className={styles["sidebar-name"]}>{user.last_name && user.first_name ? user.last_name + ' ' + user.first_name[0] + '.' : '...'}</p>
                                    <p className={styles["sidebar-role"]}>{(user.role == 'STUDENT') ? 'Студент' : 'Преподаватель'}  </p>
                                </div>
                            </div>
                        
                    </Link> 
                    <div className={styles["sidebar-nav"]}>
                        <h2>Навигация </h2>
                        <div className={styles["sidebar_nav-btns"]}>
                            {isTest == false ? <>
                            <span className={styles["sidebar-nav_source"]}>
                                <a className={styles["sidebar-nav_source-ghost"]} href="/home">Главная</a>
                            </span>
                            <span className={styles["details"]}>
                                <details>
                                    <summary className={styles["tree-nav__item-title"]}>Билеты</summary>
                                    <div className={styles["details_content"]}>
                                        <div className={styles["details-content_wrapper"]}>
                                            {(user.role == "STUDENT") ? 
                                            <>
                                                <span className={styles["details_btn"]}>
                                                    <a className={styles["details_btn-ghost"]} href="/tickets">Все билеты</a>
                                                </span>
                                                <span className={styles["details_btn"]}>
                                                    <a className={styles["details_btn-ghost"]} href="/exam">Экзамены</a>
                                                </span>
                                                <span className={styles["details_btn"]}>
                                                    <a className={styles["details_btn-ghost"]} href="/history">История билетов</a>
                                                </span>
                                            </> : <>
                                                <span className={styles["details_btn"]}>
                                                    <a className={styles["details_btn-ghost"]} href="/tickets">Мои билеты</a>
                                                </span>
                                                <span className={styles["details_btn"]}>
                                                    <a className={styles["details_btn-ghost"]} href="/new_ticket">Новый билет</a>
                                                </span>
                                                <span className={styles["details_btn"]}>
                                                    <a className={styles["details_btn-ghost"]} href="/result/table">Результаты</a>
                                                </span>
                                            </>
                                            
                                            }
                                            
                                        </div>  
                                    </div>
                                    
                                </details>
                            </span>
                            <span className={styles["sidebar-nav_source"]}>
                                <a className={styles["sidebar-nav_source-ghost"]} href="/contacts">Контакты</a>
                            </span>
                            </> : <>
                           {isTest && ticket && attemptInfo && (
                                <div className={styles["sidebar_test"]}>
                                    <p className={styles["sidebar_test-text"]}>Оставшееся время:</p>
                                    <ProgressBar
                                    totalDuration={ticket.ticket.time_limit_seconds}
                                    initialRemaining={attemptInfo.seconds}
                                    endTime={sendAsnwers}
                                    />
                                    <h2 className={styles["sidebar_test-question"]}>
                                    Вопрос {attemptInfo.question_id + 1}
                                    </h2>
                                    <p className={styles["sidebar_test-score"]}>
                                    Баллов {attemptInfo.points}
                                    </p>
                                    <a className={styles["sidebar_test-link"]}>Пометить вопрос</a>
                                    <a className={styles["sidebar_test-link"]}>Сообщить об ошибке</a>
                                    <Button
                                        type="button"
                                        style="warning"
                                        text="Завершить"
                                        onClick={() => {
                                        const confirmed = window.confirm("Вы уверены, что хотите завершить?");
                                            if (confirmed) {
                                                sendAsnwers()
                                            }
                                        }}
                                    />
                                </div>
                                )}
                            </>}
                        </div>
                        
                        
                    </div>
                    <div className={styles["sidebar-hr"]}>
                        <hr />
                        <div className={styles["sidebar_contacts"]}>
                            <a href="https://itc-team.ru/"><img src={itc} alt="" className={styles["contats_itc"]} /></a>
                            <p>Разработано Информационно-техническим сообществом</p>
                            <div className={styles["contacts_links"]}>
                                <a href="https://t.me/halfcoder"><img src={tg} alt="" className={styles["contats_itc"]} />
                                </a>
                                <a href="https://vk.com/newsitc?from=groups"><img src={vk} alt="" className={styles["contats_itc"]} />
                                </a>
                            </div>
                        </div>
                            
                    </div>
                </aside>
        //     }}
        // </UserContext.Consumer>
    );
}

export default LeftPanel;
