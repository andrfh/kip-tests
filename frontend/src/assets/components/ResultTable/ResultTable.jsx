import React, { useState, useEffect,useContext } from "react";
import styles from '../ResultTable/ResultTable.module.css'
import api from '../../../api/axios';
import Button from "../Button/Button";
import Input from "../Input/Input";
import ResultLine from "../ResultLine/ResultLine";
import { UserContext } from '../Context/user.context';


const ResultTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [result, setResult] = useState([])
    const { open, detailsOpen } = useContext(UserContext)
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        api.get('/attempts/').then((resp) => {
            setResult(resp.data);
          });         
    }, [])
    useEffect(()=> {
        // setFilteredData(result)
    }, [result])

    const filteredTickets = result.filter(result =>
        result.ticket.name.toLowerCase().includes(searchQuery.toLowerCase())
      );


  return (
            <div className={styles["main_result"]} style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>
            <div className={styles["table-container"]}>
            <div className={styles["filter-container"]}>
                <Input label='none' type="text" text="Поиск..." onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} style=''/>
                <Button style='primary' text='Фильтры' width='200'/>
            </div>
            <table className={styles["styled-table"]}>
                <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Группа</th>
                    <th>Дисциплина</th>
                    <th>Билет</th>
                    <th>Результат (%)</th>
                    <th>Оценка</th>
                    <th>Затраченное время</th>
                    <th>Дата прохождения</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {(filteredTickets.length !== 0) ? <>
                    {filteredTickets.filter(item => item.finished_at !== null)
                            .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at)) .map((item, index) => (
                        <ResultLine key={index} item={item} index={index}/>
                    ))}
                </> : <>
                    <td  colSpan="6">
                    <p className={styles["table_text"]}>Не найдено.</p>
                    </td>
                </>
                }
                </tbody>
            </table>
            </div>
            </div>
  );
};

export default ResultTable;

