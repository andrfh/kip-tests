import styles from '../TicketQuestion/TicketQuestion.module.css'
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useState } from 'react';

const TicketQuestion = ({saveData, sendAsnwers,  dispatchForm, answers, options, question, id, count, setActive, value, onChange, answer_type}) => {
    const [optionAnswer, setOptionAnswer] = useState()
    const [optionsAnswer, setOptionsAnswer] = useState([])
    return (
        <div className={styles["ticket_question"]}>
            
            <p>Вопрос {id+1} из {count}</p>
            <h1 className={styles["ticket_question_text"]}>{question}</h1>
            {(answer_type === "options" || answer_type === "option") ? 
            <>{(answer_type === "options") ? 
                <>
                <p className={styles["options_text"]}>Выберите несколько правильных ответов</p>
                <div className={styles["options"]}>
                    {options.map((item)=> {
                        let color = (item == optionsAnswer[optionsAnswer.indexOf(item)]) ? {bg: 'var(--primary)', color: 'white'} : ''
                        return (
                        <span className={styles["btn"]} >
                            <button type='button' style={{background: color.bg, color: color.color}} className={styles["options_btn"]} onClick={()=>{
                                let newArray = [...optionsAnswer]
                                if (item == optionsAnswer[optionsAnswer.indexOf(item)]) {
                                    
                                    newArray.splice(newArray.indexOf(item), 1)
                                    console.log(newArray)
                                    setOptionsAnswer(newArray)
                                } else {
                                    newArray.push(item)
                                    console.log(newArray)
                                    setOptionsAnswer(newArray)
                                }
                                
                            }}>{item}</button>
                        </span>
                )})}
                </div>
                </>
             : 
             <>
             <p className={styles["options_text"]}>Выберите <b>один</b> правилььный ответ</p>
             <div className={styles["options"]}>
                 {options.map((item)=> {
                    let color = (item == optionAnswer) ? {bg: 'var(--primary)', color: 'white'} : ''
                    return (
                     <span className={styles["btn"]}>
                         <button type='button'  style={{background: color.bg, color: color.color}} className={styles["options_btn"]} onClick={()=>{
                                setOptionAnswer(item)
                            }}>{item}</button>
                     </span>
             )})}
             </div>
             </>}</>
             : 
            <>
                <Input onChange={onChange} label='none' type='text' name='answer' text='Ваш ответ' style='' value={value}/> 
            </>}
            <div className={styles["ticket_questions-btns"]}>
                <span className={id == 0 ? styles["noClick"] : ''}>
                    <Button type='button' style='ghost' text='Назад' onClick={()=>{
                                        setActive((id == 0) ? id : id-1 )
                                        dispatchForm({ type: 'SET_VALUE', payload: {answer: answers[id-1]?.answer || ''}})
                                    }

                    }/>
                </span>
                
                <Button type='button' style='primary' text='Сохранить ответ' onClick={()=>{
                    if (answer_type === 'option') {
                        console.log('option')
                        saveData(optionAnswer, id)

                    } else if (answer_type === 'options') {
                        console.log('options')
                        saveData(optionsAnswer, id)

                    } else {
                        console.log('text')
                        saveData(value, id)

                    }
                    }


                    }/>
                {((id+1 == count) ? 
                    <Button type='button' style='ghost' text='Завершить' onClick={()=>{
                        const confirmed = window.confirm("Вы уверены, что хотите завершить?");
                        if (confirmed) {
                            sendAsnwers()
                        }
                    }}/>:
                    <Button type='button' style='ghost' text='Вперед' onClick={()=>{
                        setActive(id+1)
                        dispatchForm({ type: 'SET_VALUE', payload: {answer: answers[id+1]?.answer || ''}})
                    }}/>
                )}
            </div>
        </div>
        
    );
}

export default TicketQuestion;




// saveData - необходимо передать в value массив с ответами вида ["3", "-3"]
// парсим возможные ответы options и при нажатии ответ должен заноситься в массив, либо убираться
// если в массиве есть значение совпадающее с выбранным ответом, то подсвечивать, как выбранный
// ПОВТОРНОЕ НАЖАТИЕ НА СОХРАНИТЬ - проверять, есть ли значение в массиве и в случае наличия убирать его из него
// 











