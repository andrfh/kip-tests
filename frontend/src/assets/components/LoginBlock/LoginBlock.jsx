import styles from '../LoginBlock/LoginBlock.module.css'
import LoginInput from '../LoginInput/LoginInput';
import Button from '../Button/Button.jsx'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/user.context.jsx';
import logo_head from '../../../Images/logo_head.svg'
import logo_text from '../../../Images/logo_text.svg'
import { CSpinner } from '@coreui/react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const LoginBlock = () => {
    const { setUser } = useContext(UserContext)
    const [formData, setFormData] = useState({username: "", password: ""});
    const [load, setLoad] = useState(false)
    
    const navigate = useNavigate()
    
    let data;
    const notify = (text) => toast.error(text);
    const authSubmit = (event) => {
        setLoad(true)
        event.preventDefault();
        axios
          .post(`${__API_ROOT__}/login/`, formData)
          .then((response) => {
            data = response.data;
            if (data) {
                setUser({
                  id: data.user.id,
                  username: data.user.username,
                  first_name: data.user.first_name,
                  last_name: data.user.last_name,
                  surname: data.user.surname,
                  role: data.user.role,
                  group: data.user.study_group,
                  questions: 0
                })
    
              localStorage.setItem('t', JSON.stringify(data.token))
              navigate('/home')
              setLoad(false)
            } 
          })
          .catch((error) => {
            console.log(error)
            setLoad(false)
            notify("Неверный логин или пароль!")
          })
        }
    
        const authHandleChange = (event) => {
            const { name, value } = event.target;
            setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
          };

    return ( 
      
        <div className={styles["login"]}>
            <div className={styles["loginBlock_wrapper"]} style={(load == true) ? {opacity: 0.5} : {opacity: 1}}>
                  <div className={styles["loginBlock"]}>
                    
                    <div className={styles["login-container"]}>
                        <h2 className={styles["loginBlock_title"]}><div className={styles["login-logo"]}>
                <img src={logo_head} className={styles["login-logo_head"]} alt="" />
              </div>Авторизация</h2>
                        <form className={styles["loginBlock_form"]} method="post" onSubmit={authSubmit} >    
                            <LoginInput label="Логин" type="text" name='username' onChange={authHandleChange} isLoad={load}/>
                            <LoginInput label="Пароль" type="password" name='password' onChange={authHandleChange} isLoad={load}/>
                            <div className={styles["loginBlock_wrapper"]}>
                                <div className={styles["loginBlock_checkbox"]}>
                                    <input className={styles["loginBlock_checkbox-input"]} type='checkbox'name='checkbox' id='checkbox'/>
                                    <label className={styles["loginBlock_checkbox-label"]} htmlFor="checkbox">Запомнить меня</label>
                                </div>
                                <a href="#" className={styles["loginBlock-forgot"]}>Забыл пароль</a>
                            </div>
                            <Button style='primary' text='Войти'/>
                            
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
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
   
        
     );
}
 
export default LoginBlock;