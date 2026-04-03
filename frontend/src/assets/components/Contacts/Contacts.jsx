import '../Contacts/Contacts.css'
import school from '../../../Images/school.svg'
import settings from '../../../Images/settings.svg'
import { useState, useContext } from 'react'
import { UserContext } from '../Context/user.context.jsx';

import { use } from 'react'

const Contacts = () => {
    const { open, detailsOpen } = useContext(UserContext)

    const [faqs, setFaqs] = useState([
        {
            question: "Как зарегистрироваться на платформе?",
            answer:"Вы можете зарегистрироваться, используя университетскую почту или через код приглашения, предоставленный преподавателем.",
            isOpen: false
        },
        {
            question: "Что делать, если я забыл пароль?",
            answer:"На странице входа нажмите 'Забыли пароль?', введите вашу почту, и мы отправим инструкцию для восстановления.",
            isOpen: false
        },
        {
            question: "Могу ли я посмотреть свои предыдущие результаты?",
            answer:"Да, в разделе 'История билетов' доступна история всех пройденных билетов с оценками и подробностями.",
            isOpen: false
        },
        {
            question: "Как связаться с техподдержкой?",
            answer:"Вы можете написать в поддержку через форму на странице 'Контакты' или по email support@kipzachet.ru.",
            isOpen: false
        },
      ])

    // const faqs = ;

    const toggleFaqs = (index) => {
        const newFaqs = faqs.map((faq, i) =>
            i === index ? { ...faq, isOpen: !faq.isOpen } : faq
        );
        setFaqs(newFaqs);
    };

    return ( 
      
        <div className='contacts' style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>
            <div className="conacts_blocks">
                <div className="contacts_blocks-block">
                    <span>
                        <img src={school} alt="" />
                    </span>
                    <div className="text">
                        <h3>Колледж информатики и программирования</h3>
                        <p><a href="https://kip.fa.ru/">kip.fa.ru</a> | kip@fa.ru  </p>
                    </div>
                </div>
                <div className="contacts_blocks-block">
                    <span>
                        <img src={settings} alt="" />
                    </span>
                    <div className="text">
                        <h3>Техническая поддержка</h3>
                        <p>support@kipzachet.ru</p>
                    </div>
                </div>
            </div>
            <h2>Быстрые вопросы и ответы</h2>
            <div className="contacts_faq">
                {faqs.map((item, index) => (
                    <div key={index} className={`contacts_faq-block ${item.isOpen ? 'open' : ''}`}>
                    <div className="faq_text" onClick={() => toggleFaqs(index)}>
                        <h3>{item.question}</h3>
                        <button className="faq_toggle">{item.isOpen ? '−' : '+'}</button>
                    </div>
                    <div className={`faq_answer ${item.isOpen ? 'visible' : ''}`}>
                        <p>{item.answer}</p>
                    </div>
                    </div>
                ))}
                </div>
        </div>
   
        
     );
}
 
export default Contacts;