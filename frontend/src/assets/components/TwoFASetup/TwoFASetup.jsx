import { useState, useContext } from 'react';
import api from '../../../api/axios';
import { UserContext } from '../Context/user.context';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import './TwoFASetup.css';

const TwoFASetup = () => {
  const { user, loadMe } = useContext(UserContext);
  const [step, setStep] = useState('idle'); 
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!['TEACHER', 'ADMIN'].includes(user.role)) {
    return null;
  }

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const response = await api.get('/2fa/setup/');
      setQrCode(response.data.qr_code);
      setSecret(response.data.secret);
      setStep('setup');
    } catch {
      toast.error('Ошибка при получении QR-кода.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/2fa/confirm/', { code });
      setStep('done');
      await loadMe(); 
      toast.success('2FA успешно активирована!');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Неверный код. Проверьте время на устройстве.');
      } else {
        toast.error('Ошибка. Попробуйте снова.');
      }
    } finally {
      setCode('');
      setLoading(false);
    }
  };

  const handleDisable = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/2fa/disable/', { code: disableCode });
      await loadMe();
      setStep('idle');
      toast.success('2FA отключена.');
    } catch {
      toast.error('Неверный код.');
    } finally {
      setDisableCode('');
      setLoading(false);
    }
  };

  const is2faEnabled = user.totp_enabled;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Двухфакторная аутентификация</h3>

      {is2faEnabled ? (
        <div>
          <p style={{ color: 'green' }}>2FA включена</p>
          <p>Для отключения введите код из Authenticator:</p>
          <form onSubmit={handleDisable}>
            <input
              className='input_input'
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              placeholder="000000"
              disabled={loading}
            />
            <Button type="submit" style='ghost' disabled={loading || disableCode.length !== 6} text='Отключить 2FA'/>
          </form>
        </div>
      ) : step === 'idle' ? (
        <div>
          <p style={{ color: '#888' }}>2FA не настроена</p>
          <Button type="button" style='primary' onClick={handleStartSetup} disabled={loading} text="Настроить 2FA" />
        </div>
      ) : step === 'setup' ? (
        <div>
          <p>1. Установите <strong> Authenticator</strong> на телефон</p>
          <p>2. Отсканируйте QR-код:</p>
          <img src={qrCode} alt="QR-код для 2FA" style={{ width: 200, height: 200 }} />
          <p>Или введите ключ вручную: <code>{secret}</code></p>
          <p>3. Введите 6-значный код из приложения:</p>
          <form onSubmit={handleConfirm}>
            <input
              class='input_input'
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              autoFocus
              disabled={loading}
            />
            <Button type="submit" style='primary' disabled={loading || code.length !== 6} text="Подтвердить"/>
            <Button type="button" style='ghost' onClick={() => setStep('idle')} disabled={loading} text="Отмена"/>
          </form>
        </div>
      ) : (
        <div>
          <p style={{ color: 'green' }}>2FA успешно активирована!</p>
          <p>Теперь при каждом входе потребуется код из Authenticator.</p>
        </div>
      )}
    </div>
  );
};

export default TwoFASetup;