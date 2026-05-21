import styles from '../ResultLine/ResultLine.module.css'
import { useState } from 'react';
import Button from "../Button/Button";
import ModalResult from '../ModalResult/ModalResult';

const ResultLine = ({item, index}) => {
    const [resultVisible, setResultVisible] = useState(false)

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
    
        const parts = [];
        if (hrs > 0) parts.push(`${hrs} ${hrs === 1 ? "час" : hrs < 5 ? "часа" : "часов"}`);
        if (mins > 0) parts.push(`${mins} ${mins === 1 ? "минута" : mins < 5 ? "минуты" : "минут"}`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs} ${secs === 1 ? "секунда" : secs < 5 ? "секунды" : "секунд"}`);
    
        return parts.join(" ");
    };
  

    
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
        const calculatePercentage = (score, maxScore) => {
            if (maxScore === 0) return 0;
            return ((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed();
          };
        
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
        
    
    return (     
        <tr className={styles[index % 2 === 0 ? "even-row" : "odd-row"]}>
            <td>{item.student.last_name + ' ' + item.student.first_name[0] + '.' + item.student.surname[0] + '.'}</td>
            <td>{item.ticket.study_group.name}</td>
            <td>{item.ticket.subject.name}</td>
            <td className={styles["result_ticket-name"]}>{item.ticket.name}</td>
            <td>{calculatePercentage(item.points, item.ticket.max_points)}%</td>
            <td className={styles[setMark(item.points, item.ticket.max_points).color]}>{setMark(item.points, item.ticket.max_points).mark}</td>
            <td>{formatTime(item.time_spent_seconds)}</td>
            <td>{formatDate(item.finished_at)}</td>
            <td>
                <Button onClick={() => setResultVisible(true)} style='ghost' width='150px' height='30px' text='Подробнее'>
                Подробнее
                </Button>
            </td>
            <ModalResult result={item} visible={resultVisible} setVisible={setResultVisible} />
        </tr>
    );
}

export default ResultLine;


