import styles from './ModalResult.module.css'
import { NavLink } from 'react-router-dom';
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'
import ProgressBar from '../ProgressBar/ProgressBar';
import { useState, useEffect } from 'react';
import axios from "axios";


const ModalResult = ({visible, setVisible, result}) => {
    const [progress, setProgress] = useState(0);
    let userToken = JSON.parse(localStorage.getItem('t'))
    const [resultTicket, setResultTicket] = useState()


    const calculatePercentage = (score, maxScore) => {
        if (maxScore === 0) return 0;
        return ((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed();
      };

      let percentage = calculatePercentage(result.points, result.ticket.max_points)

    
    const setMark = (points, max_points) => {
        let score = calculatePercentage(points, max_points)
        let mark
        let color
        if (score >= 80) {
            mark = 5
            color = 'light_green'
        } else if (score >= 60 && score < 80) {
            mark = 4
            color = 'green'
        } else if (score >= 30 && score < 60) {
            mark = 3
            color = 'orange'
        } else {
            mark = 2
            color = 'red'
        }
        return {mark: mark, color:color, score: score}
    }
       

    // result={item} percentage={calculatePercentage(item.points, item.ticket.max_points)} 

    let mark = setMark(result.points, result.ticket.max_points)

    
    useEffect(() => {
        if(result === 'notTable')
        axios.get(`${__API_ROOT__}/attempts/${id}`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => {
            setResultTicket(resp.data);
          });         
    }, [])
    useEffect(() => {
        if (visible) {
            const interval = setInterval(() => {
                if (progress < percentage) {
                    setProgress((prev) => Math.min(prev + 1, percentage));
                } else if (progress > percentage) {
                    setProgress((prev) => Math.max(prev - 1, percentage));
                }
                }, 10);
        
                return () => clearInterval(interval);
        }
    }, [visible]);

    const formatDate = (isoString) => {
        const months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
        
        const date = new Date(isoString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        
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

    // Вспомогательная функция для склонения
    const decline = (num, forms) => {
        const n = Math.abs(num) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return forms[2];
        if (n1 > 1 && n1 < 5) return forms[1];
        if (n1 === 1) return forms[0];
        return forms[2];
    };

    
    const radius = 50; // Радиус окружности
    const circumference = 2 * Math.PI * radius; // Длина окружности
    const offset = circumference - (progress / 100) * circumference; // Смещение для создания эффекта
    return ( 
        <div className={styles["modal"]}>
            {result && result.length !== 0 ? 
            <CModal
                size="xl"
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="ScrollingLongContentExampleLabel2"
                >
                    <CModalHeader>
                        <h1 className={styles["modal-title"]}>Результат прохождения:</h1>
                    </CModalHeader>
                <CModalBody>
                    <div className={styles["modal-body"]}>
                        {/* <h2 className={styles["main_title"]}>Результат прохождения:</h2> */}
                        <div className={styles["result_stroke"]}>
                            <div className={styles["progressBarContainer"]}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle
                                    className={styles["circleBackground"]}
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    strokeWidth="10"
                                    />
                                    <circle
                                    className={styles["circleProgress"]}
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    strokeWidth="10"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}  // Добавлена анимация
                                    />
                                    <text x="50%" y="50%" textAnchor="middle" dy="0.3em" className={styles["progressText"]}>
                                    {progress}%
                                    </text>
                                </svg>
                            </div>
                            <div className={styles["result_stroke-ticket"]}>
                                <h2>{result.ticket.name}</h2>
                                <p>Дисциплина: {result.ticket.subject.name}</p>
                            </div>
                            <div className={styles["result_stroke-score"]}>
                                <h2>Получено баллов:</h2>
                                <p>{result.points}/{result.ticket.max_points}</p>
                            </div>
                            <div className={styles["result_stroke-mark"]}>
                                <h2>Оценка:</h2>
                                <p className={styles[mark.color]}>{mark.mark}</p>
                            </div>

                            
                        </div>   
                        <div className={styles["result_stroke"]}>
                            <div className={styles["result_stroke-info"]}>
                                <h2>ФИО</h2>
                                <p>{result.student.last_name + ' ' + result?.student.first_name[0] + '.' + result?.student.surname[0] + '.'}</p>
                            </div>
                            <div className={styles["result_stroke-info"]}>
                                <h2>Группа</h2>
                                <p>{result.ticket.study_group.name}</p>
                            </div>
                            <div className={styles["result_stroke-info"]}>
                                <h2>Дата прохождения</h2>
                                <p>{formatDate(result.finished_at)}</p>
                            </div>
                            <div className={styles["result_stroke-info"]}>
                                <h2>Затраченное время</h2>
                                <p>{formatDuration(result.time_spent_seconds)}</p>
                            </div>
                        </div> 
                        <h2 className={styles["result_title"]}>Ответы:</h2>
                    <div className={styles["result_list"]}>
                        {result.questions?.map((item, index) => {
                            const answerData = result.answers?.[item.id];

                            // Если нет данных по ответу на вопрос — пропускаем этот блок
                            if (!answerData || answerData.answer == null) return null;

                            const points = answerData.points ?? 0;
                            const answer = answerData.answer;

                            if (item.answer_type === 'option') {
                                return (
                                <div className={styles["result_block"]} key={index}>
                                    <h1>Вопрос {index + 1}</h1>
                                    <h2>{item.text}</h2>
                                    <div className={styles["result_block-answers"]}>
                                    {item.options?.map((itotem, idx) => {
                                        let style;
                                        if (itotem === answer && points !== 0) {
                                        style = "answer-green";
                                        } else if (itotem === answer && points === 0) {
                                        style = "answer-red";
                                        } else {
                                        style = "answer";
                                        }
                                        return (
                                        <span key={idx} className={styles[style]}>{itotem}</span>
                                        );
                                    })}
                                    </div>
                                    <p className={styles["result_block-score"]}>
                                    Получено баллов {points} / {item.points}
                                    </p>
                                </div>
                                );
                            } else if (item.answer_type === 'options') {
                                return (
                                <div className={styles["result_block"]} key={index}>
                                    <h1>Вопрос {index + 1}</h1>
                                    <h2>{item.text}</h2>
                                    <div className={styles["result_block-answers"]}>
                                    {item.options?.map((itotem, idx) => {
                                        let style;
                                        if (Array.isArray(answer) && answer.includes(itotem) && points !== 0) {
                                        style = "answer-green";
                                        } else if (Array.isArray(answer) && answer.includes(itotem) && points === 0) {
                                        style = "answer-red";
                                        } else {
                                        style = "answer";
                                        }
                                        return (
                                        <span key={idx} className={styles[style]}>{itotem}</span>
                                        );
                                    })}
                                    </div>
                                    <p className={styles["result_block-score"]}>
                                    Получено баллов {points} / {item.points}
                                    </p>
                                </div>
                                );
                            } else {
                                return (
                                <div className={styles["result_block"]} key={index}>
                                    <h1>Вопрос {index + 1}</h1>
                                    <h2>{item.text}</h2>
                                    <div className={styles["result_block-answers"]}>
                                    <span className={points !== 0 ? styles["answer-green"] : (answer !== '' && answer !== ' ' && answer ? styles["answer-red"] : styles["answer"] )}>
                                        {answer !== '' && answer !== ' ' && answer ? answer : 'Ответ не дан'}
                                    </span>
                                    </div>
                                    <p className={styles["result_block-score"]}>
                                    Получено баллов {points} / {item.points}
                                    </p>
                                </div>
                                );
                            }
                            })}
                                                        
                    </div> 
                    </div>
                </CModalBody>
                
            </CModal>
            :
            <></>
        }
        </div>
     );
}
 
export default ModalResult;