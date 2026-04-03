import styles from './HistoryTicketInfo.module.css'
import Ticket from '../Ticket/Ticket';
import Input from '../Input/Input';
import filters from '../../../Images/filters.svg'
import axios from 'axios';
import { useState, useEffect } from 'react';

const HistoryTicketInfo = ({result, ticketId}) => {

    const [progress, setProgress] = useState(0);
    let userToken = JSON.parse(localStorage.getItem('t'))
    const [mark, setMark] = useState({mark: 'Загрузка', color:'light_green', score: 'Загрузка'})

    let ready = result.finished_at ? true : false

    const calculatePercentage = (score, maxScore) => {
        if (maxScore === 0) return 0;
        return ((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed();
      };

    //   

    
    const setNewMark = (points, max_points) => {
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
       
    
    useEffect(() => {
        if (result) {
            setMark(setNewMark(result.points, result.ticket.max_points))
             
        }
    }, [ticketId])
    
    useEffect(() => {
        if (ticketId) {
            let percentage = calculatePercentage(result.points, result.ticket.max_points)
            const interval = setInterval(() => {
                if (progress < percentage) {
                    setProgress((prev) => Math.min(prev + 1, percentage));
                } else if (progress > percentage) {
                    setProgress((prev) => Math.max(prev - 1, percentage));
                }
                }, 10);
        
                return () => clearInterval(interval);
        }
    }, [ticketId]);


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
    
    const radius = 50; // Радиус окружности
    const circumference = 2 * Math.PI * radius; // Длина окружности
    const offset = circumference - (progress / 100) * circumference; // Смещение для создания эффекта
    
    return (
        <div className={styles["modal-body"]}>
            {result ? <>
                <h2 className={styles["main_title"]}>Результат прохождения:</h2>
           {ready ? <> 
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
                    <p>{result.student.last_name + ' ' + result.student.first_name[0] + '.' + result.student.surname[0]}</p>
                </div>
                <div className={styles["result_stroke-info"]}>
                    <h2>Группа</h2>
                    <p>{result.ticket.study_group.name}</p>
                </div>
                <div className={styles["result_stroke-info"]}>
                    <h2>Дата прохождения</h2>
                    <p>{formatDate(result.finished_at)}</p>
                </div>
            </div> 
            <h2 className={styles["result_title"]}>Ответы:</h2>
            <div className={styles["result_list"]}>
                {result.questions?.map((item, index) => {
                    if (item.answer_type == 'option') {
                        return (
                        <div className={styles["result_block"]} key={index}>
                            <h1>Вопрос {index+1}</h1>
                            <h2>{item.text}</h2>
                            <div className={styles["result_block-answers"]}>
                                {item.options.map(itotem => {
                                    let style 
                                    if (itotem === result.answers[item.id].answer && result.answers[item.id].points !== 0) {
                                        style = "answer-green"
                                    } else if (itotem === result.answers[item.id].answer && result.answers[item.id].points == 0) {
                                        style = "answer-red"
                                    } else {
                                        style = "answer"
                                    }
                                    return(

                                        <span className={styles[style]}>{itotem}</span>
                                    )
                                })}
                                
                            </div>
                            <p className={styles["result_block-score"]}>Получено баллов {result.answers[item.id].points} / {item.points}</p>
                        </div>
                        )
                    } else if (item.answer_type == 'options') { //НУЖЕН ЧАТ ГПТ!!!!!!
                        return (
                        <div className={styles["result_block"]} key={index}>
                            <h1>Вопрос {index+1}</h1>
                            <h2>{item.text}</h2>
                            <div className={styles["result_block-answers"]}>
                                {item.options.map(itotem => {
                                    let style 
                                    if (result.answers[item.id].answer.includes(itotem) && result.answers[item.id].points !== 0) {
                                        style = "answer-green"
                                    } else if (result.answers[item.id].answer.includes(itotem) && result.answers[item.id].points == 0) {
                                        style = "answer-red"
                                    } else {
                                        style = "answer"
                                    }
                                    return(

                                        <span className={styles[style]}>{itotem}</span>
                                    )
                                })}
                                
                            </div>
                            <p className={styles["result_block-score"]}>Получено баллов {result.answers[item.id].points} / {item.points}</p>
                        </div>
                        )
                    } else {
                        return (
                            <div className={styles["result_block"]} key={index}>
                                <h1>Вопрос {index+1}</h1>
                                <h2>{item.text}</h2>
                                <div className={styles["result_block-answers"]}>
                                    <span className={result.answers[item.id].points != 0 ? styles["answer-green"] : styles["answer-red"]}>{result.answers[item.id].answer}</span>
                                    
                                </div>
                            <p className={styles["result_block-score"]}>Получено баллов {result.answers[item.id].points} / {item.points}</p>
                            </div>
                        )
                    }
                }
                    
                )}
            </div></> : <>Результатов еще нет</>  }
        
            </> : <div className={styles['takeTicket']}><h1>Выберите билет</h1></div>}
         </div>    
    );
}

export default HistoryTicketInfo;