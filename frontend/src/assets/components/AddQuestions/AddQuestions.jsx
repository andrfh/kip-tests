import { useState, useReducer, useEffect, useRef} from 'react';
import styles from '../AddQuestions/AddQuestions.module.css'
import QuestionLink from '../QuestionLink/QuestionLink';
import { INITIAL_STATE, formReducer } from './AddQuestions.state';
import Input from '../Input/Input';
import Checkbox from '../TicketCheckbox/TicketCheckbox';
import Button from '../Button/Button';
import Textarea from '../Textarea/Textarea'
import api from '../../../api/axios';
import TimeInput from '../TimeInput/TimeInput';

const AddQuestions = ({ ticket, setTicket, onSubmit, data, saveData, addQuestion, setData, clearForm}) => {
    const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
	const { isFormReadyToSubmit, values, isValid } = formState;
    const [subjects, setSubjects] = useState();
    const [groups, setGroups] = useState();
    useEffect(() => {
        dispatchForm({ type: 'SET_VALUE', payload: {
            name: data.name || 'Новый билет',
            disc: data.disc || '',
            group: data.group || '',
            status: data.status || '',
            time: data.time || '',
            max_attempts: data.max_attempts || '',
            question: data.questions[0].question || '',
            answer: data.questions[0].answer || '',
            score: data.questions[0].score || ''
            
        }})
        api.get('/subjects/').then((resp) => {
            setSubjects(resp.data);
            console.log(subjects)
          });
        api.get('/study_groups/').then((resp) => {
            setGroups(resp.data);
            console.log(groups)
        });
    }, [])

    const addQuestionsItem = (e) => {
		e.preventDefault();
		dispatchForm({ type: 'SUBMIT' });
	};

    const onClear = () => {
        clearForm();
        dispatchForm({ type: 'CLEAR' });
        setTicket(0)
    }
    
    useEffect(() => {
		if (isFormReadyToSubmit) {
            console.log('Form ready to submit!')
            saveData(values, ticket)
            let ready = true;
            for(let i = 0;i < data.questions.length;i++){
                if(!data.questions[i].id || !data.questions[i].question || !data.questions[i].answer || !data.questions[i].score) {
                    setTicket(Number(data.questions[i].id)-1)
                    console.log(data.questions[i].id)
                    dispatchForm({ type: 'SET_VALUE', payload: data.questions[i]});
                    console.log(data.questions[i])
                    dispatchForm({ type: 'SUBMIT' });
                    console.log('not ready')
                    ready = false;
                    break;
                }
            }
            if (ready) {
                console.log('Submit')
                onSubmit(values, dispatchForm); 
                dispatchForm({ type: 'CLEAR' });
                setTicket(0)
            }
        }
	}, [isFormReadyToSubmit, values, onSubmit, data, setTicket, saveData]);

    useEffect(() => {
		let timerId;
		if (!isValid.name || !isValid.max_attempts || !isValid.time || !isValid.disc || !isValid.group || !isValid.question || !isValid.answer || !isValid.score) {
			timerId = setTimeout(() => {
				dispatchForm({ type: 'RESET_VALIDITY' });
			}, 2000);
		}

		return () => {
			clearTimeout(timerId);
		};
	}, [isValid]);

    const formatTime = (value) => {
        let numbers = value.replace(/\D/g, "");
        let formatted = "";
        
        if (numbers.length > 6) numbers = numbers.slice(0, 6);
        if (numbers.length > 4) {
            formatted = numbers.slice(0, 2) + ":" + numbers.slice(2, 4) + ":" + numbers.slice(4, 6);
        } else if (numbers.length > 2) {
            formatted = numbers.slice(0, 2) + ":" + numbers.slice(2, 4);
        } else {
            formatted = numbers;
        }
        
        return formatted;
    };

    const onChange = (e) => { 
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.value }});
	};

    const onChangeChecked = (e) => { 
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.checked }});
	};
    const onChangeTime = (e) => { 
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: formatTime(e.target.value) }});
	};

    return (
        <div className={styles["new_questions"]}>
            <form onSubmit={addQuestionsItem} >
                <input className={styles["main_title"] + `${(!isValid.name) ? ' invalid' : ' '}`} onChange={onChange} type='text' name='name' value={values.name} maxLength='128' />
                <div className={styles["input-data"]}>
                    
                        {/* <Input onChange={onChange} label='Дисциплина' type='text' name='disc' value={values.disc} style={(!isValid.disc) ? ' invalid' : ' '}/>  */}
                        {/* <Input onChange={onChange} label='Группа' type='text' name='group' value={values.group} style={(!isValid.group) ? ' invalid' : ' '}/>  */}
                        <div className={styles["input"]}>
                            <h2 className={styles["input_label"]}>Дисциплина</h2>
                            <select onChange={onChange} value={values.disc} name="disc" className={styles["group-select"]}>
                                <option value="">Выберите предмет:</option>
                                {(subjects) ? 
                                <>

                                    {subjects.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                })}
                                </>
                                :
                                <option>Загрузка предметов...</option>
                                
                                }
                                
                                
                            </select>
                        </div>
                        
                        <div className={styles["input"]}>
                            <h2 className={styles["input_label"]}>Группа</h2>
                            <select onChange={onChange} value={values.group} name="group" className={styles["group-select"]}>
                                <option value="">Выберите группу:</option>
                                {(groups) ? 
                                <>

                                    {groups.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                })}
                                </>
                                :
                                <option>Загрузка групп...</option>
                                
                                }
                                
                                
                            </select>
                        </div>

                        <Checkbox onChange={onChangeChecked} name='status' value={values.status}/> 
                        
                </div>
                <TimeInput onTimeChange={onChangeTime} name='time' formatTime={formatTime} value={values.time}/>
                <Input maxlength='2' onChange={onChange} name='max_attempts' label='Кол-во попыток:' type='text'  value={values.max_attempts} style={(!isValid.max_attempts) ? ' invalid' : ' '}/>
                <div className={styles["questions"]}>
                    {Object.keys(data.questions).map((item, index) => {
                        return (
                            <QuestionLink 
                                number={index + 1} 
                                key={item} 
                                onClick={() => {
                                    saveData(values, index)
                                    setTicket(index)
                                    dispatchForm({ type: 'SET_VALUE', payload: {
                                        name: data.name || values.name || '',
                                        disc: data.disc || values.disc || '',
                                        group: data.group || values.group  || '',
                                        status: data.status || values.status || '',
                                        time: data.time || values.time || '',
                                        max_attempts: values.max_attempts || data.max_attempts || '',
                                        question: data.questions[index].question || '',
                                        answer: data.questions[index].answer || '',
                                        score: data.questions[index].score || ''
                                    }})
                                    
                                }} 
                                isActive={(item == ticket) ? true : false}
                                isCompleted={(data.questions[index].question && data.questions[index].answer && data.questions[index].score) ? true : false}
                                data = {data}
                                values = {values}
                                ticket={ticket}
                                setData = {setData}
                                setTicket= {setTicket}
                                dispatchForm = {dispatchForm}
                            />
                        )
                    })}
                    <QuestionLink number='+' type='add' onClick={() => {
                        saveData(values, ticket)
                        addQuestion(values)
                        setTicket(data.questions.length)
                        dispatchForm({ type: 'SET_VALUE', payload: {
                            name: values.name || data.name || '',
                            disc: values.disc || data.disc || '',
                            group: values.group || data.group  || '',
                            status: values.status || data.status || '',
                            time: values.time || data.time || '',
                            max_attempts: values.max_attempts || data.max_attempts || '',
                            question: '',
                            answer: '',
                            score: ''
                        }})
                    }}/>
                </div>
                <h2 className={styles["constructor-title"]}>Вопрос {ticket + 1}</h2>
                {/* <Input label='Тип вопроса' type='text'/> */}
                <Textarea maxlength='100' onChange={onChange} name='question'  value={values.question} style={(!isValid.question) ? ' invalid' : ' '}/>
                <Input maxlength='25' onChange={onChange} name='answer' label='Ответ' type='text' value={values.answer} style={(!isValid.answer) ? ' invalid' : ' '} />
                <Input maxlength='2' onChange={onChange} name='score' label='Кол-во баллов' type='text'  value={values.score} style={(!isValid.score) ? ' invalid' : ' '}/>

                <div className={styles["buttons"]}>
                    <Button type='submit' style='ghost' text='Опубликовать'/>
                    <Button type='button' style='warning' text='Сбросить' onClick={onClear}/>
                </div>
            </form>
    
        </div>
        
    );
}

export default AddQuestions;
