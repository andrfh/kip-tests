import styles from '../LoginBlock/LoginBlock.module.css';
import LoginInput from '../LoginInput/LoginInput';
import Button from '../Button/Button.jsx';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/user.context.jsx';
import logo_head from '../../../Images/logo_head.svg';
import api from '../../../api/axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginBlock = () => {
  const { login, setSession } = useContext(UserContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [load, setLoad] = useState(false);

  // 2FA состояния
  const [twoFaRequired, setTwoFaRequired] = useState(false);
  const [twoFaUserId, setTwoFaUserId] = useState(null);
  const [otpCode, setOtpCode] = useState('');

  const navigate = useNavigate();
  const notify = (text) => toast.error(text);

  const authSubmit = async (event) => {
    event.preventDefault();
    setLoad(true);

    try {
      const response = await api.post('/login/', formData);

      if (response.status === 202) {
        // Пользователь с 2FA — показываем форму OTP
        setTwoFaRequired(true);
        setTwoFaUserId(response.data.user_id);
        return;
      }

      // Обычный логин — устанавливаем сессию через контекст
      setSession(response.data.user);
      navigate('/home');
    } catch (error) {
      if (error.response?.status === 401) {
        notify('Неверный логин или пароль!');
      } else if (error.response?.status === 429) {
        notify('Слишком много попыток входа. Попробуйте позже.');
      } else {
        notify('Ошибка сервера. Попробуйте позже.');
      }
    } finally {
      setLoad(false);
    }
  };

  const authHandleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setLoad(true);

    try {
      const response = await api.post('/2fa/verify/', {
        user_id: twoFaUserId,
        code: otpCode,
      });

      // Успешная OTP-верификация: сервер вернул cookie + данные пользователя
      setSession(response.data.user);
      navigate('/home');
    } catch (error) {
      if (error.response?.status === 401) {
        notify('Неверный код. Попробуйте снова.');
        setOtpCode('');
      } else {
        notify('Ошибка. Попробуйте войти заново.');
        setTwoFaRequired(false);
        setOtpCode('');
      }
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className={styles['login']}>
      <div
        className={styles['loginBlock_wrapper']}
        style={load ? { opacity: 0.5 } : { opacity: 1 }}
      >
        <div className={styles['loginBlock']}>
          <div className={styles['login-container']}>
            <h2 className={styles['loginBlock_title']}>
              <div className={styles['login-logo']}>
                <img src={logo_head} className={styles['login-logo_head']} alt='' />
              </div>
              Авторизация
            </h2>

            {twoFaRequired ? (
              <form onSubmit={handleOtpSubmit} className={styles['loginBlock_form-fa']}>
                <p>Введите 6-значный код из Authenticator:</p>
                <input
                  className={styles['input']}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  autoFocus
                  disabled={load}
                />
                <Button type="submit" style='primary' disabled={load || otpCode.length !== 6} text='Подтвердить' />

                <Button
                  type="button"
                  style='ghost'
                  onClick={() => {
                    setTwoFaRequired(false);
                    setOtpCode('');
                    setTwoFaUserId(null);
                    setFormData({ username: '', password: '' }); 
                  }}
                  disabled={load}
                  text='Вернуться к логину'
                />

                <ToastContainer position='top-center' autoClose={3000} theme='light' />
              </form>
            ) : (
              <form
                className={styles['loginBlock_form']}
                method='post'
                onSubmit={authSubmit}
              >
                <LoginInput label='Логин' type='text' name='username' onChange={authHandleChange} isLoad={load} />
                <LoginInput label='Пароль' type='password' name='password' onChange={authHandleChange} isLoad={load} />
                <div className={styles['loginBlock_wrapper']}>
                  <div className={styles['loginBlock_checkbox']}>
                    <input className={styles['loginBlock_checkbox-input']} type='checkbox' name='checkbox' id='checkbox' />
                    <label className={styles['loginBlock_checkbox-label']} htmlFor='checkbox'>Запомнить меня</label>
                  </div>
                  <a href='#' className={styles['loginBlock-forgot']}>Забыл пароль</a>
                </div>
                <Button style='primary' text='Войти' />
                <ToastContainer
                  position='top-center'
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover={false}
                  theme='light'
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBlock;