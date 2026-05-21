 import styles from '../NewTicket/NewTicket.module.css'
import AddQuestions from '../AddQuestions/AddQuestions';
import useLocalStorage from '../../../hooks/use-localstorage.hook';
import { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../api/axios';
import { UserContext } from '../Context/user.context';


const NewTicket = () => {
    const [ticket, setTicket] = useState(0)
    const { open, detailsOpen } = useContext(UserContext)
    const [items, setItems] = useLocalStorage('data', {
            "name": "Новый билет",
            "disc": "",
            "group": "",
            "status": false,
            "time": "",
            "max_attempts": "",
            "questions": [
                {
                    "id": 1,
                    "list_id": 1,
                    "question": "",
                    "answer": "",
                    "score": ""
                }
            ]
        })
    const [tickets, setTickets] = useLocalStorage('tickets', [])
    
    const INITIAL_LS_DATA = {
        "name": "Новый билет",
        "disc": "",
        "group": "",
        "status": false,
        "time": "",
        "max_attempts": "",
        "questions": [
            {
                "id": 1,
                "list_id": 1,
                "question": "",
                "answer": "",
                "score": ""
            }
        ]
    }
    
    const notify = (text) => toast.success(text);

    function timeToSeconds(timeStr) {
        let [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    const addItem = (values) => {
        let newTicket = {
            disc: values.disc || items.disc,
            group: values.group || items.group,
            status: values.status || items.status,
            time: values.time || items.time,
            max_attempts: values.max_attempts || items.max_attempts,
            questions: [
                ...items.questions,
                {
                    id: items.questions.length > 0 ? Math.max(...items.questions.map(i => i.id)) + 1 : 1,
                    list_id: items.questions.length > 0 ? Math.max(...items.questions.map(i => i.list_id)) + 1 : 1,
                    question: values.question,
                    answer: values.answer,
                    score: values.score
                }
            ]
        }

        let max_points = 0
        items.questions.map(item => {
            max_points = max_points + Number(item.score)
        })

        let serverTicket = {
            study_group: values.group || items.group,
            subject: values.disc || items.disc,
            name: values.name || items.name,
            is_open: values.status || items.status,
            closes_at: new Date(),
            questions: 
                items.questions.map(item => {
                    return {
                        answer_type: 'text',
                        correct_answer: item.answer,
                        points: Number(item.score),
                        text: item.question,
                        id: item.id-1
                    }
                })
            ,
            max_points: max_points, 
            max_attempts: values.max_attempts || items.max_attempts,
            time_limit_seconds: timeToSeconds(values.time)
        }
        setTickets(Array(...tickets, newTicket))
        api
          .post('/tickets/', serverTicket)
          .then(console.log(serverTicket))
          .then((response) => {
            if (response.request.status.toString()[0] == 2) {
                toast.success('Билет успешно создан!')
                setItems(INITIAL_LS_DATA);
                
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error('Не удалось создать билет. Ошибка ' + error.response.status)
          });
        
    };

    const saveData = (values, savedId) => {
        let newData = {
            name: values.name || items.name,
            disc: values.disc || items.disc,
            group: values.group || items.group,
            status: values.status || items.status,
            time: values.time || items.time,
            max_attempts: values.time || items.max_attempts,
            questions: [
                ...items.questions
            ]
        }
        for(let i = 0;i < newData.questions.length;i++){
            if(newData.questions[i].list_id == ticket+1) {
                newData.questions[i].question = values.question;
                newData.questions[i].answer = values.answer;
                newData.questions[i].score = values.score;
                setItems(newData)
                setTicket(savedId)
            }  
        }
        setItems(newData)
    }

    const clearForm = () => {
        setItems({
            "name": "Новый билет",
            "disc": "",
            "group": "",
            "status": false,
            "time": "",
            "max_attempts":"",
            "questions": [
                {
                    "id": 1,
                    "list_id": 1,
                    "question": "",
                    "answer": "",
                    "score": ""
                }
            ]
        });
        notify('Форма сбросилась!')
    }

    const addQuestion = (values) => {
        setItems({
            name: (ticket == 0) ? values.name : values.name || items.name,
            disc: values.disc || items.disc,
            group: values.group || items.group,
            status: values.status || items.status,
            time: values.time || items.time,
            max_attempts: values.max_attempts || items.max_attempts,
            questions: [
                ...items.questions,
                {
                    id: items.questions.length > 0 ? Math.max(...items.questions.map(i => i.id)) + 1 : 1,
                    list_id: items.questions.length > 0 ? Math.max(...items.questions.map(i => i.list_id)) + 1 : 1,
                    question: '',
                    answer: '',
                    score: ''
                }
            ]
        });
        
    }

    
    
    return (       
               <div className={styles["newTicket"]}  style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>
                <AddQuestions ticket={ticket} setTicket={setTicket} onSubmit={addItem} data={items} setData={setItems} saveData={saveData} addQuestion={addQuestion} clearForm={clearForm}/>
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
                </div>
    );
}

export default NewTicket;


