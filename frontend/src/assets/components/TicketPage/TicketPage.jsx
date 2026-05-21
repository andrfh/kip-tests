import styles from '../TicketPage/TicketPage.module.css'
import { useParams } from 'react-router-dom';
import { useState, useEffect, useReducer, useContext } from 'react';
import api from '../../../api/axios';
import QuestionLink from '../QuestionLink/QuestionLink';
import TicketQuestion from '../TicketQuestion/TicketQuestion';
import { INITIAL_STATE, formReducer } from './TicketPage.state';
import useLocalStorage from '../../../hooks/use-localstorage.hook';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../Context/user.context';


const TicketPage = () => {
    const navigate = useNavigate();
    const {attempt_id} = useParams()
    const [ticket, setTicket] = useState();
    const [active, setActive] = useState();
    const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
	const { isFormReadyToSubmit, values, isValid } = formState;
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    // let attempt_id = JSON.parse(localStorage.getItem('aid'))
    const [answers, setAnswers] = useLocalStorage('answers', [])
    const { attemptInfo, setAttemptInfo } = useContext(UserContext)
    
    
    function getRemainingTime(startTimeStr, maxTimeInSeconds) {
        const startTime = new Date(startTimeStr);
        const now = new Date();

        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remainingTime = maxTimeInSeconds - elapsedSeconds;

        return Math.max(remainingTime, 0);
    }
    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setTime((prevTime) => {
                // console.log("Текущее время:", prevTime + 1); 
                return prevTime + 1;
              });
        }, 1000);


    }, [isRunning]);
    const stopTimer = () => setIsRunning(false);
    useEffect(() => {
        api.get(`/attempts/${attempt_id}`).then((resp) => {
            setActive(0)
            setTicket(resp.data);
            if (resp.data.finished_at) {
                return navigate("/error"); 
            }
        });
      }, []);
    
    useEffect(() => {
        setAnswers(ticket?.questions.map(index => {
            return {
                id: index.id,
                answer: ''
            }
        }));
        setAttemptInfo({
                seconds: getRemainingTime(ticket?.started_at, ticket?.ticket.time_limit_seconds),
                question_id: ticket?.questions[active].id,
                points: ticket?.questions[0].points,
                subject: ticket?.ticket.subject.name
            })
    }, [ticket])
      
    //   for (let i = 0; i < ticket?.questions.length; i++) {
    //     let newAnswer = {
    //         id: i,
    //         answer: ''
    //     }
    //     answerArray.push(newAnswer)
        
    //   }
      
    // useEffect(() => {
    //     dispatchForm({ type: 'SET_VALUE', payload: {
    //         name: data.name || 'Новый билет',
    //         disc: data.disc || '',
    //         group: data.group || '',
    //         status: data.status || '',
    //         time: data.time || '',
    //         question: data.questions[0].question || '',
    //         answer: data.questions[0].answer || '',
    //         score: data.questions[0].score || ''
            
    //     }})
    // }, [])

    const addQuestionsItem = (e) => {
		e.preventDefault();
		dispatchForm({ type: 'SUBMIT' });
	};

    const onClear = () => {
        dispatchForm({ type: 'CLEAR' });
        setTicket(0)
    }

    const sendAsnwers = () => {
        let newBody = {
            answers: answers
        }
        api
          .post(`/attempts/${attempt_id}/submit/`, newBody.answers)
          .then(console.log(newBody))
          .then((response) => {
            if (response.request.status.toString()[0] == 2) {
                stopTimer()
                localStorage.removeItem('answers')
                return navigate("/home"); 
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error('Не удалось отправить ответы. Ошибка ' + error.response.status)
          });
    }

    useEffect(() => {
		let timerId;
		if (!isValid.answer) {
			timerId = setTimeout(() => {
				dispatchForm({ type: 'RESET_VALIDITY' });
			}, 2000);
		}

		return () => {
			clearTimeout(timerId);
		};
	}, [isValid]);

    const onChange = (e) => { 
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.value }});
	};

    const setValue = (id, ) => {
        dispatchForm({ type: 'SET_VALUE', payload: {answer: answers[id].answer || ''}})
    }

    const saveData = (value, savedId) => {
        let newData = [...answers]

        newData[savedId].answer = value
        setAnswers(newData)
        let newAnswers = attemptInfo
        newAnswers.answers = newData
        toast.success('Ответ сохранён!')
        setAttemptInfo(newAnswers)
    }
    
    return (       
        <div className={styles["ticketPage"]}>
        {(ticket) ? <>
                        <div className={styles["questions"]}>
                            {ticket?.questions.map((item, index) => {
                                return (
                                    <QuestionLink 
                                    number={item.id+1} 
                                    key={item.id} 
                                    onClick={() => {
                                        
                                        setAttemptInfo(prev => ({
                                            ...prev,
                                            question_id: item.id,
                                            points: item.points
                                        }));
                                        setActive(item.id)
                                        dispatchForm({ type: 'SET_VALUE', payload: {answer: answers[index].answer || ''}})
                                    }} 
                                    isActive={(item.id == active) ? true : false}
                                    isCompleted={(answers) ? (answers[index].answer) ? true : false : ''}
                                    type='info'
                                    />
                            )})}
                        
                    </div>
                    <TicketQuestion 
                        sendAsnwers={sendAsnwers} 
                        dispatchForm={dispatchForm} 
                        answers={answers} 
                        saveData={saveData} 
                        onChange={onChange} 
                        value={values.answer} 
                        setActive={setActive} 
                        question={ticket.questions[active]?.text} 
                        id={ticket.questions[active]?.id} 
                        count={ticket.questions?.length}/>
                </>
                : <>loading...</>}
            <ToastContainer
                            position="top-center"
                            autoClose={1000}
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

export default TicketPage;


