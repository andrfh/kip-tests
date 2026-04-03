import styles from '../Content/Content.module.css'
import Ticket from '../Ticket/Ticket'
import moment from 'moment';
import useLocalStorage from '../../../hooks/use-localstorage.hook';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/user.context';
import squares from '../../../Images/Squares.svg'
import strokes from '../../../Images/Strokes.svg'
import Input from '../Input/Input';
import Button from '../Button/Button';
import { CSpinner } from '@coreui/react'


const Content = () => {
    const [searchQuery, setSearchQuery] = useState('');
    // const tickets = JSON.parse(localStorage.getItem('tickets'))
    const [tickets, setTickets] = useState([]);
    const [subjects, setSubjects] = useState();
    const [isSquare, setIsSquare] = useState(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const { open, detailsOpen } = useContext(UserContext)


    let filterWindows = isFiltersOpen ? '-40px' : '-390px'
    // const { userData, setUserData } = useContext(UserContext);
    let userToken = JSON.parse(localStorage.getItem('t'))
    useEffect(() => {
      axios.get(`${__API_ROOT__}/tickets/`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => {
        const allTickets = resp.data;
        setTickets(allTickets);
      });
      axios.get(`${__API_ROOT__}/subjects/`, { headers: { Authorization: `Token ${userToken}`}}).then((resp) => {
        setSubjects(resp.data);
      });
    }, []);

    const filteredTickets = tickets.filter(ticket =>
        ticket.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
        <div className={styles["content"]} style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>

            <div className={styles["content_nav"]} >
            <Input onChange={(e) => setSearchQuery(e.target.value)} name='answer' label='none' type='text' style='' value={searchQuery} text='Поиск' />
            <div className={styles["content_nav-btns"]}>
                    <Button type='button' style='ghost' text='Фильтры' onClick={() => {setIsFiltersOpen(true)}}/>
                    {/* <span className={styles["btn"]}>
                        <button className={styles["content_nav-btn"]} onClick={()=>setIsSquare(!isSquare)}>
                            <img src={isSquare ? strokes : squares} alt="" />
                        </button>
                    </span> */}
                </div>
            </div>            
   
            <div className={styles["tickets"]} style={(!isSquare) ? {flexDirection: 'column'} : null  }>
                {filteredTickets ?  
                    <>
                    {filteredTickets.map((item, index) => {
                        return(
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
                                attempt={item.max_attempts}
                                time={item.time_limit_seconds}
                                go={`/ticket/${item.id}`}
                                res={`/result/${item.id}`}
                                id={item.id}
                                btns={true}
                                width={isSquare ? "square" : "line"}
                            />
                        )
                        
                    })}
                    </>
                :
                <CSpinner color="primary" variant="grow" />

}
                
                </div>
                {/* <div className={styles["side-panel"]} style={{right: filterWindows}}>
                    <div className={styles["side-title"]}>Выдвижная панель:</div>
                    <p>Здесь будут фильтры</p>
                    <Button type='button' style='ghost' text='Закрыть' onClick={() => {setIsFiltersOpen(false)}}/>
                </div> */}
        </div>       
        
    );
}

export default Content;