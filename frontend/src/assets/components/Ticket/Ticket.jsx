import styles from './Ticket.module.css'
import { Link } from 'react-router-dom';
import Button from '../Button/Button'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import close from '../../../Images/close.svg'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/user.context';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import ModalResult from '../ModalResult/ModalResult';
import bg from '../../../Images/ticketBackground.jpg'
import test from '../../../Images/Test.svg'
import discImg from '../../../Images/disc.svg'
import groupImg from '../../../Images/group.svg'
import dateImg from '../../../Images/date.svg'
import { ToastContainer, toast } from 'react-toastify';


const Ticket = ({name, width, isProcessing, process, group, subject, btns, state, go, res, closes_at, created_at, questions, max_points, time, attempt, attempt_left, author, id, isHistory, final_at}) => {
    const [visible, setVisible] = useState(false)
    const [resultVisible, setResultVisible] = useState(false)
    const [load, setLoad] = useState(false)
    let token = JSON.parse(localStorage.getItem('t'))
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const notify = (text) => toast.error(text);
    const { attemptInfo, setAttemptInfo } = useContext(UserContext)

    console.log(created_at)
    function getRemainingTime(startTimeStr, maxTimeInSeconds) {
        const startTime = new Date(startTimeStr);
        const now = new Date();

        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remainingTime = maxTimeInSeconds - elapsedSeconds;

        return Math.max(remainingTime, 0);
    }



    const startTicket = (event) => {
        setLoad(true)
        event.preventDefault();
        axios
          .post(`${__API_ROOT__}/attempts/`, {ticket: Number(id)}, { headers: { Authorization: `Token ${token}`}})
          .then((response) => {
            let data = response.data;   
            console.log(getRemainingTime(data.started_at, time))
            setAttemptInfo({
                seconds: getRemainingTime(data.started_at, time),
                question_id: 1,
                points: data.questions[0].points,
                subject: subject
            })
            console.log(attemptInfo)
            localStorage.setItem('aid', JSON.stringify(data.id))
            navigate(`/ticket/${data.id}`)
            setLoad(false)
            })
          .catch((error) => {
            if (error?.response.status == 406) {
                notify("Больше попыток нет!")
            }
            console.log(error)
            setLoad(false)
          })
        }

    const formateDate = (dateString) => {
        const date = new Date(dateString);
        const months = [
            "января", "февраля", "марта", "апреля", 
            "мая", "июня", "июля", "августа", 
            "сентября", "октября", "ноября", "декабря"
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    const formatDateTime = (isoString) => {
    if (!isoString) return '';

    const date = new Date(isoString);
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    

    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${hours}:${minutes}`;
};

const formatDuration = (totalSeconds) => {
        if (typeof totalSeconds !== 'number' || totalSeconds < 0) return '';

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];

        if (hours > 0) parts.push(`${hours} ${decline(hours, ['час', 'часа', 'часов'])}`);
        if (minutes > 0) parts.push(`${minutes} ${decline(minutes, ['минута', 'минуты', 'минут'])}`);
        if (seconds > 0) parts.push(`${seconds} ${decline(seconds, ['секунда', 'секунды', 'секунд'])}`);

        return parts.join(' ');
    };


    const decline = (num, forms) => {
        const n = Math.abs(num) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return forms[2];
        if (n1 > 1 && n1 < 5) return forms[1];
        if (n1 === 1) return forms[0];
        return forms[2];
    };

    let isNeedToClick = btns ? '' : 'pointer'

    return ( 
        <span className={styles["ticket_output"]} style={{cursor: isNeedToClick}}>
            {width == 'square' ? 
            <div className={styles["ticket"]}>
                <div className={styles["ticket_bar"]}>
                    <span className={styles["ticket_bar-icon"]}><img src={test}/></span>
                    <h2 className={styles["ticket_bar-name"]}>{name}</h2>
                </div>
                <div className={styles["ticket_info"]}>
                    <span className={styles["ticket_info-item"]}><img src={discImg}/> {subject}</span>
                    <span className={styles["ticket_info-item"]}><img src={groupImg}/>{author.last_name + ' ' + author.first_name[0] + '.' + author.surname[0] + '.'}</span>
                    <span className={styles["ticket_info-item"]}><img src={dateImg}/> {isHistory ? 'Завершен ' + formatDateTime(final_at) : (created_at == 'none' ? 'Прохождение' : 'От ' + formateDate(created_at))}</span>
                </div>
                
                <div className={styles["ticket_btns"]}>
                    {isProcessing && user.role == "STUDENT" ? <>
                    <Link to={{
                            pathname: process
                            // state: attempt_id
                        }}>
                        <span className={styles["ticket_btn"]}>
                            <button className={styles["ticket__btn-res"]}>Продолжить</button>
                        </span>
                    </Link>
                    </> : 
                    <>
                    {btns ? <><span className={styles["ticket_btn"]}>
                        <button className={styles["ticket__btn-res"]} onClick={() => setVisible(!visible)}>{(state == true && user.role == 'STUDENT') ? <>Приступить</> : <>Информация</>}</button>
                    </span>
                    
                    
                    <button className={styles["ticket_btns-options"]}>
                        <span className={styles["dot"]} />
                        <span className={styles["dot"]} />
                        <span className={styles["dot"]} />
                    </button></>
                    
                    :
                <>
                    <Link to={{
                            pathname: res,
                            // state: attempt_id
                        }}>
                        <span className={styles["ticket_btn"]}>
                            <button className={styles["ticket__btn-res"]}>Результаты</button>
                        </span>
                    </Link>
                    </>}  </>}
                    

                </div>
                
            </div>
            :
            <div className={styles["ticket_line"]}>
                <div className={styles["ticket_bar_line"]}>
                    <div className={styles["tickets_bar-group"]}>
                        <span className={styles["ticket_bar-icon"]}><img src={test}/></span>
                        <h2 className={styles["ticket_bar-name"]}>{name}</h2>
                    </div>
                    <button className={styles["ticket_btns-options"]}>
                        <span className={styles["dot"]} />
                        <span className={styles["dot"]} />
                        <span className={styles["dot"]} />
                    </button>
                </div>
                
                <div className={styles["ticket_info"]}>
                    <span className={styles["ticket_info-item"]}><img src={discImg}/> {subject}</span>
                    <span className={styles["ticket_info-item"]}><img src={groupImg}/>{author.last_name + ' ' + author.first_name[0] + '.' + author.surname[0] + '.'}</span>
                    <span className={styles["ticket_info-item"]}><img src={dateImg}/> {isHistory ? 'Завершен ' + formatDateTime(final_at) : (created_at == 'none' ? 'Прохождение' : 'От ' + formateDate(created_at))}</span>
                </div>
                
                <div className={styles["ticket_btns"]}>
                    {isProcessing && user.role == "STUDENT" ? <>
                    <Link to={{
                            pathname: process
                            // state: attempt_id
                        }}>
                        <span className={styles["ticket_btn"]}>
                            <button className={styles["ticket__btn-res"]}>Продолжить</button>
                        </span>
                    </Link>
                    </> : 
                    <>
                    {btns ? 
                    <span className={styles["ticket_btn"]}>
                        <button className={styles["ticket__btn-res"]} onClick={() => setVisible(!visible)}>{(state == true  && user.role == 'STUDENT')  ? <>Приступить</> : <>Информация</>}</button>
                    </span>
                    
                    
                    
                    :
                <>
                    <Link to={{
                            pathname: res,
                            // state: attempt_id
                        }}>
                        <span className={styles["ticket_btn"]}>
                            <button className={styles["ticket__btn-res"]}>Результаты</button>
                        </span>
                    </Link>
                    </>}
                    </>}
                </div>
                

            </div>
            }
            <CModal
                size='lg'
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="ScrollingLongContentExampleLabel2"
                >
                    <CModalHeader>
                        <div className={styles["modal_container"]}>
                          <h2 className={styles["ticket__title"]}>{name}</h2>
                        </div>
                    </CModalHeader>
                <CModalBody>
                    <div className={styles["modal_container"]}>
                        <div className={styles["ticket_info"]}>
                            <p className={styles["ticket__paragraph"]}>Преподаватель:  <span className={styles["ticket_semibold"]}>{author.last_name + ' ' + author.first_name[0] + '.' + author.surname[0] + '.'}</span></p>
                            <p className={styles["ticket__paragraph"]}>Дисциплина:  <span className={styles["ticket_semibold"]}>{subject}</span></p>
                            {user.role == 'STUDENT' ? 
                            <p className={styles["ticket__paragraph"]}>Попытка:  <span className={styles["ticket_semibold"]}>{attempt - attempt_left} / {attempt}</span></p>
                            :
                            <p className={styles["ticket__paragraph"]}>Кол-во попыток:  <span className={styles["ticket_semibold"]}>{attempt}</span></p>
                            }
                            <p className={styles["ticket__paragraph"]}>Открыт до:  <span className={styles["ticket_semibold"]}>{formateDate(closes_at)}</span></p>
                            <p className={styles["ticket__paragraph"]}>Максимум баллов:  <span className={styles["ticket_semibold"]}>{max_points}</span></p>
                            <p className={styles["ticket__paragraph"]}>Максимальное время:  <span className={styles["ticket_semibold"]}>{formatDuration(time)}</span></p>
                        </div>
                        {/* <h5 className={styles["modal_subtitle"]}>Теоритический материал:</h5>
                        <div className={styles["modal_files"]}>
                            <span className={styles["modal_file"]}>
                                <a href='../../../Images/kip.pptx' download><span className={styles["modal_file-subtitle"]}>kip.pptx</span></a>
                            </span>
                            <span className={styles["modal_file"]}>
                                <a href='../../../Images/document.docx' download><span className={styles["modal_file-subtitle"]}>document.docx</span></a>
                            </span>
                            <span className={styles["modal_file"]}>
                                <a href='../../../Images/doc.pdf' download><span className={styles["modal_file-subtitle"]}>doc.pdf</span></a>
                            </span>
                        </div> */}
                    </div>
                </CModalBody>
                
                {(state == true && user.role == 'STUDENT') ? 
                <CModalFooter>
                    {/* <Link to={{
                            pathname: go,
                            state: id
                        }}> */}
                        <span className={styles["ticket_btn"]}>
                            <button className={styles["ticket__btn-res"]} onClick={startTicket}>Приступить</button>
                        </span>
                    {/* </Link>  */}
                </CModalFooter>
                : ''  
                }
                    
                    
                            <ToastContainer
                              position="top-center"
                              autoClose={3000}
                              hideProgressBar={false}
                              newestOnTop={false}
                              closeOnClick
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover={false}
                              theme="light"
                            />
                
                </CModal>
                {/* <ModalResult visible={resultVisible} setVisible={setResultVisible} result='notTable' id={id}/> */}

                
        </span>
        
     );
}
 
export default Ticket;