import './History.css'
import Ticket from '../Ticket/Ticket';
import Input from '../Input/Input';
import filters from '../../../Images/filters.svg'
import api from '../../../api/axios';
import { useState, useEffect,useContext } from 'react';
import { UserContext } from '../Context/user.context.jsx';
import squares from '../../../Images/Squares.svg'
import strokes from '../../../Images/Strokes.svg'
import HistoryTicketInfo from '../HistoryTicketInfo/HistoryTicketInfo';

const History = () => {

    const [result, setResult] = useState()
    const [isSquare, setIsSquare] = useState(false)
    const { open, detailsOpen } = useContext(UserContext)

    useEffect(() => {
      api.get('/attempts/').then((resp) => {
        setResult(resp.data);
      });
    }, []);
    
    return (
        <div className="history_container" style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>
            <div className="history">
                <div className="history_search">
                    <Input maxlength='25' onChange={()=> {console.log('Поиск')}} name='search' label='none' type='text' style='' text='Поиск...' />
                    <div className="btns">
                        <span className="history-btn">
                            <button className='history_search-settings'><img src={filters} alt="" /></button>
                        </span>
                        {/* <span className="btn">
                            <button className="content_nav-btn" onClick={()=>setIsSquare(!isSquare)}>
                                <img src={isSquare ? strokes : squares} alt="" />
                            </button>
                        </span> */}
                    </div>
                    
                </div>
                <div className="history_tickets" style={(!isSquare) ? {flexDirection: 'column'} : null  }>
                    {result ? result
                            .filter(item => item.finished_at !== null)
                            .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at)) 
                            .map((item, index) => (
                                <Ticket
                                key={item.ticket.id}
                                name={item.ticket.name}
                                created_at={item.finished_at}
                                max_points={item.ticket.max_points}
                                author={item.ticket.author}
                                subject={item.ticket.subject.name}
                                group={item.ticket.study_group.name}
                                state={false}
                                id={item.ticket.id}
                                res={`/result/${item.id}`}
                                btns={false}
                                isHistory={true}
                                final_at={item.finished_at}
                                width={isSquare ? 'square' : 'line'}
                                />
                            ))
                        : <>Загрузка...</>}

                    
                </div>
            </div>
            {/* <div className="result">
                {result ? 
                <HistoryTicketInfo result={idOfTicket ? result.filter(item => (item.id == idOfTicket))[0] : false} ticketId={idOfTicket} />
                    :
                    <></>}
            </div> */}
        </div>
    );
}

export default History;
