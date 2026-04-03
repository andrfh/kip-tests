import styles from '../Profile/Profile.module.css'
import Input from '../Input/Input';
import Button from '../Button/Button';
import makaka from '../../../Images/bibizyana.png'
import exit from '../../../Images/exit.svg'
import { UserContext } from '../Context/user.context';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logout from '../../../Images/logout.svg'



const Profile = () => {
    const { open, detailsOpen } = useContext(UserContext)

    const navigate = useNavigate()
    const onLogout = () => {
        navigate('/')
        localStorage.clear();
    }
    const { user } = useContext(UserContext)
    return (
        <div className={styles["profile_wrapper"]} style={{marginTop: detailsOpen ? (open ? '350px' : '0') : (open ? '170px' : '0')}}>
                <div className={styles["profile"]}>
                    <img src={makaka} alt="" className={styles["sidebar-icon"]} />
                    <div className={styles["profile_title"]}>
                        <h2 className={styles["profile_title-name"]}>{user.first_name + ' ' + user.last_name}</h2>
                        <p className={styles["profile_title-role"]}>{(user.role == 'STUDENT') ? 'Студент' : 'Преподаватель'}</p>
                    </div>
                    <button className={styles["profile_items-logout"]} onClick={onLogout}>
                        <p className='p'>Выйти</p>
                        <img className='img' src={logout} alt="" />
                    </button>
                </div>
                <h2 className={styles["profile_info"]}>Персональная информация</h2>
                <div className={styles["profile_info-inputs"]}>
                    <Input label='Имя пользователя' type='text' name='name' defaultValue={user.username} style=''/> 
                    <Input label='Полное имя' type='text' name='name' defaultValue={user.first_name + ' ' + user.last_name} style=''/> 
                    <Input label='Email' type='text' name='email' defaultValue={user.id} style=''/> 
                    
                    {(user.role == 'STUDENT') ? <Input label='Группа' type='text' name='group' defaultValue={user.group} style=''/> : <></>} 
                </div>
                <Button type='submit' style='ghost' text='Сохранить изменения'/>

                <h2 className={styles["profile_info"]}>Пароль</h2>
                <div className={styles["profile_info-inputs"]}>
                    <Input label='Новый пароль' type='password' name='email' defaultValue='Мэйл' style=''/> 
                </div>
                <Button type='submit' style='ghost' text='Сохранить изменения'/>
    </ div>
    );
}

export default Profile;