import styles from '../ResultOfTicket/ResultOfTicket.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from "axios";

const ResultOfTicket = () => {
    const { attempt_id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const userToken = JSON.parse(localStorage.getItem('t'));
    useEffect(() => {
    if (!attempt_id) return;

    axios.get(`${__API_ROOT__}/attempts/${attempt_id}`, {
        headers: { Authorization: `Token ${userToken}` }
    })
    .then((resp) => {
        setResult(resp.data);
        const percent = calculatePercentage(resp.data.points, resp.data.ticket?.max_points);
        

        setProgress(0);
        setTimeout(() => {
            setProgress(percent);
        }, 100); 
    })
    .catch((err) => {
            if (err.response && (err.response.status === 403 || err.response.status === 404)) {
                navigate('/error'); // 🔁 редиректим на страницу ошибки
            } else {
                console.error("Ошибка загрузки данных:", err);
    }});
}, [attempt_id]);


    const calculatePercentage = (score, maxScore) => {
        if (!score || !maxScore) return 0;
        return ((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed();
    };

    const setMark = (points, max_points) => {
        const score = calculatePercentage(points, max_points);
        let mark = 2, color = 'red';

        if (score >= 80) {
            mark = 5; color = 'light_green';
        } else if (score >= 60) {
            mark = 4; color = 'green';
        } else if (score >= 30) {
            mark = 3; color = 'orange';
        }

        return { mark, color, score };
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const date = new Date(isoString);
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
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


    if (!result) return <p className={styles["loading"]}>Загрузка...</p>;

    const mark = setMark(result.points, result.ticket?.max_points);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={styles["modal-body"]}>
            <h2 className={styles["main_title"]}>Результат прохождения:</h2>
            <div className={styles["result_stroke"]}>
                <div className={styles["progressBarContainer"]}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle className={styles["circleBackground"]} cx="60" cy="60" r={radius} strokeWidth="10" />
                        <circle className={styles["circleProgress"]} cx="60" cy="60" r={radius} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
                        <text x="50%" y="50%" textAnchor="middle" dy="0.3em" className={styles["progressText"]}>
                            {progress}%
                        </text>
                    </svg>
                </div>

                <div className={styles["result_stroke-ticket"]}>
                    <h2>{result.ticket?.name || ''}</h2>
                    <p>Дисциплина: {result.ticket?.subject?.name || ''}</p>
                </div>

                <div className={styles["result_stroke-score"]}>
                    <h2>Получено баллов:</h2>
                    <p>{result.points ?? 0}/{result.ticket?.max_points ?? 0}</p>
                </div>

                <div className={styles["result_stroke-mark"]}>
                    <h2>Оценка:</h2>
                    <p className={styles[mark.color]}>{mark.mark}</p>
                </div>
            </div>

            <div className={styles["result_stroke"]}>
                <div className={styles["result_stroke-info"]}>
                    <h2>ФИО</h2>
                    <p>{`${result.student?.last_name ?? ''} ${result.student?.first_name?.[0] ?? ''}.${result.student?.surname?.[0] ?? ''}.`}</p>
                </div>
                <div className={styles["result_stroke-info"]}>
                    <h2>Группа</h2>
                    <p>{result.ticket?.study_group?.name || ''}</p>
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

                    const hasAnswer = answerData && answerData.answer != null && answerData.answer !== "" && answerData.answer !== " ";
                    const points = hasAnswer ? answerData.points ?? 0 : 0;
                    const answer = hasAnswer ? answerData.answer : "Ответ не дан";

                    const renderOptions = (optionItem, idx) => {
                        let style = "answer";
                        if (Array.isArray(answer) ? answer.includes(optionItem) : answer === optionItem) {
                            style = points !== 0 ? "answer-green" : "answer-red";
                        }
                        return <span key={idx} className={styles[style]}>{optionItem}</span>;
                    };

                    return (
                        <div className={styles["result_block"]} key={index}>
                            <h1>Вопрос {index + 1}</h1>
                            <h2>{item.text}</h2>
                            <div className={styles["result_block-answers"]}>
                                {item.options?.length 
                                    ? item.options.map(renderOptions)
                                    : (
                                        <span className={
                                            hasAnswer
                                                ? (points !== 0 ? styles["answer-green"] : styles["answer-red"])
                                                : styles["answer"]
                                        }>
                                            {answer}
                                        </span>
                                    )}
                            </div>
                            <p className={styles["result_block-score"]}>
                                Получено баллов {points} / {item.points}
                            </p>
                        </div>
                    );
                })}


            </div>
        </div>
    );
};

export default ResultOfTicket;
