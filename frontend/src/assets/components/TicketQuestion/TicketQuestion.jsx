import styles from '../TicketQuestion/TicketQuestion.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';

const TicketQuestion = ({ saveData, sendAsnwers, dispatchForm, answers, question, id, count, setActive, value, onChange }) => {
  return (
    <div className={styles['ticket_question']}>
      <p>Вопрос {id + 1} из {count}</p>
      <h1 className={styles['ticket_question_text']}>{question}</h1>

      <Input onChange={onChange} label='none' type='text' name='answer' text='Ваш ответ' style='' value={value} />

      <div className={styles['ticket_questions-btns']}>
        <span className={id == 0 ? styles['noClick'] : ''}>
          <Button
            type='button'
            style='ghost'
            text='Назад'
            onClick={() => {
              setActive(id == 0 ? id : id - 1);
              dispatchForm({ type: 'SET_VALUE', payload: { answer: answers[id - 1]?.answer || '' } });
            }}
          />
        </span>

        <Button
          type='button'
          style='primary'
          text='Сохранить ответ'
          onClick={() => {
            saveData(value, id);
          }}
        />

        {id + 1 == count ? (
          <Button
            type='button'
            style='ghost'
            text='Завершить'
            onClick={() => {
              const confirmed = window.confirm('Вы уверены, что хотите завершить?');
              if (confirmed) {
                sendAsnwers();
              }
            }}
          />
        ) : (
          <Button
            type='button'
            style='ghost'
            text='Вперед'
            onClick={() => {
              setActive(id + 1);
              dispatchForm({ type: 'SET_VALUE', payload: { answer: answers[id + 1]?.answer || '' } });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TicketQuestion;
