import styles from '../Home/Home.module.css'
import Ticket from '../Ticket/Ticket'
import moment from 'moment';
import useLocalStorage from '../../../hooks/use-localstorage.hook';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/user.context';
import Button from '../Button/Button';
import logo from '../../../Images/logo_head.svg'
import landing from '../../../Images/landing.png'
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { setQuestions } = useContext(UserContext)
    const [tickets, setTickets] = useState([]);
    const [attempts, setAttempts] = useState([])
    let userToken = JSON.parse(localStorage.getItem('t'))
    const { open, detailsOpen } = useContext(UserContext)
    const activeTickets = tickets.filter(ticket => ticket.attempts_left !== 0);


    useEffect(() => {
      axios.get(`${__API_ROOT__}/tickets/`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => {
        setTickets(resp.data);
        setQuestions(resp.data.length)
      });
      axios.get(`${__API_ROOT__}/attempts/`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => {
        setAttempts(resp.data);
      });
    }, []);
    return (
        // <main className={styles["main"]}>
        //     <div className={styles["main-container"]}>
        //         <Header day={date.getDate()} month={months[date.getMonth()]} text={`Добрый день, ${userData.user.first_name}`} subtitle='У вас 5 открытых билетов' onLogout={onLogout}/>
                <div className={styles["active_block"]} style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>
                    <div className={styles["active-nav"]}>
                        <h2 className={styles["main_tickets"]}>Активные билеты:</h2>
                        <Link to='/tickets'><Button style='primary' text='Посмотреть все'/></Link>
                    </div>
                    <div className={styles["tickets_block"]}>
                        <div className={styles["tickets"]}>

                                {activeTickets.length > 0 ? (
                                    activeTickets.map((item, index) => {
                                        // 🔍 Фильтрация попыток по билету
                                        const relatedAttempts = attempts
                                            .filter(attempt => attempt.ticket.id === item.id)
                                            .sort((a, b) => new Date(b.started_at) - new Date(a.started_at)); // Последняя сверху
                                        const lastAttempt = relatedAttempts[0];
                                        
                                        const isProcessing = lastAttempt?.finished_at === null;
                                        console.log(isProcessing)

                                        return (
                                            <Ticket
                                                key={index}
                                                name={item.name}
                                                closes_at={item.closes_at}
                                                created_at={item.created_at}
                                                max_points={item.max_points}
                                                author={item.author}
                                                subject={item.subject.name}
                                                group={item.study_group.name}
                                                is_open={item.is_open}
                                                attempt_left={item.attempts_left}
                                                state={item.attempts_left !== 0}
                                                isProcessing={isProcessing}
                                                process={isProcessing ? `/ticket/${lastAttempt.id}` : ''}
                                                attempt={item.max_attempts}
                                                time={item.time_limit_seconds}
                                                // res={`/result/${lastAttempt.id}`}
                                                id={item.id}
                                                btns={true}
                                                width="line"
                                            />
                                        );
                                    })
                                ) : (
                                    <p>Нет билетов</p>
                                )}
                        </div> 
                    </div>
                </div>
        //         <footer className={styles["home_footer"]}>
        //             <p>©2025 KIPZACHETY</p>
        //         </footer>
        //         <h2 className={styles["main_tickets"]}>Учебные группы</h2>
        //         <div className={styles["groups"]}>
        //             <div className={styles["groups_block"]}>
        //                 <h3 className={styles["groups_block-title"]}>3ОИБАС-922</h3>
        //                 <p className={styles["groups_block-students"]}>Студентов: 25</p>
        //                 <p className={styles["groups_block-ticket"]}>Активные билеты: 0</p>
        //                 <Button type='button' style='primary' text='Подробнее' onClick={()=>{console.log('КОнец')}}/>

        //             </div>
        //         </div>
        //     </div>
        // </main>
        
        
    );
}

export default Home;