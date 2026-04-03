import styles from '../QuestionLink/QuestionLink.module.css'
import close from '../../../Images/close.svg'

const QuestionLink = ({ number, isActive, isCompleted, type, onClick, data, values, ticket, setData, setTicket, isClose, dispatchForm}) => {
    const deleteQuestion = (index, values) => {
        data.questions.splice(index, 1)
        for(let i = 0; i < data.questions.length; i++ ) {
            data.questions[i].list_id = i+1
        }
        if (index == data.questions.length) {
            setData({
                name: values.name || data.name,
                disc: values.disc || data.disc,
                group: values.group || data.group,
                status: values.status || data.status,
                questions: [
                    ...data.questions
             ]
             });
            setTicket(index-1)
            dispatchForm({ type: 'SET_VALUE', payload: {
                disc: values.disc || data.disc,
                group: values.group || data.group,
                status: values.status || data.status,
                question: data.questions[index-1].question || '',
                answer: data.questions[index-1].answer || '',
                score: data.questions[index-1].score || ''
            }});
            
        } else if (index == ticket) {
            setData({
                name: values.name || data.name,
                disc: values.disc || data.disc,
                group: values.group || data.group,
                status: values.status || data.status,
                questions: [
                    ...data.questions
             ]
             });
            dispatchForm({ type: 'SET_VALUE', payload: {
                disc: values.disc || data.disc,
                group: values.group || data.group,
                status: values.status || data.status,
                question: data.questions[index].question || '',
                answer: data.questions[index].answer || '',
                score: data.questions[index].score || ''
            }});
        } else {
            setData({
                name: values.name || data.name,
                disc: values.disc || data.disc,
                group: values.group || data.group,
                status: values.status || data.status,
                questions: [
                    ...data.questions
             ]
             });
        }
        
        console.log(data.questions)
        
         
        
        
        
     }
    
    return ( 
        <span className={styles['select-question']}>
            <button type='Button' className={`${styles['question-link']} ${styles[((isActive == true) ? 'active' : ((isCompleted == true) ? 'completed' : 'gray'))]} ${styles[`${type}`]}`} onClick={onClick}>
                <span className={styles['question-number']}>{number}</span>            
            </button>
            {(type !== 'add' && type !== 'info') ? 
            <button type='Button' className={styles['question-delete'] } onClick={() => {deleteQuestion(number - 1, values)}}>
                <img src={close} alt="" />
            </button> : ''}
        </span>
    
     );
}
 
export default QuestionLink;