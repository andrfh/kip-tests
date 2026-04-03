import './App.css'
import { React, useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from './assets/layouts/LoginPage/Login'
import { Routes, Route} from 'react-router-dom';
import Body from './assets/layouts/Body/Body'
import LeftPanel from './assets/components/LeftPanel/LeftPanel';
import Content from './assets/components/Content/Content'
import NewTicket from './assets/components/NewTicket/NewTicket'
import ResultTeable from './assets/components/ResultTable/ResultTable';
import TicketPage from './assets/components/TicketPage/TicketPage'
import ResultOfTicket from './assets/components/ResultOfTicket/ResultOfTicket';
import Profile from './assets/components/Profile/Profile'
import { UserContext } from './assets/components/Context/user.context';
import {UserContextProvider} from './assets/components/Context/user.context'
import NotFound from './assets/components/NotFound/NotFound';
import Home from './assets/components/Home/Home';
import ContentWrapper from './assets/layouts/Content/ContentWrapper';
import { createContext } from 'react';
import Contacts from './assets/components/Contacts/Contacts';
import PrivateRoute from './assets/components/PrivateRoute/PrivateRoute';
import History from './assets/components/History/History';
import Exam from './assets/components/Exam/Exam';
// const AuthContext = createContext()


const App = () => {
  return (   
    <UserContextProvider>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/error' element={<NotFound error={'403'}/>} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <PrivateRoute>
              <Body>
                <LeftPanel isTest={false}/>
                <ContentWrapper text={''} subtitle='' isHome={true}>
                  <Home/>
                </ContentWrapper>
              </Body>
            </PrivateRoute>
            } />
          <Route path="/tickets" element={
            <PrivateRoute>
            <Body>
              <LeftPanel isTest={false}/>
              <ContentWrapper text='Все билеты' subtitle=''>
                <Content/>
              </ContentWrapper>
            </Body>
          </PrivateRoute>} />
          <Route path='/ticket'>
            <Route path=":attempt_id" element={
            <PrivateRoute>
              <Body>
                <LeftPanel isTest={true}/>
                <ContentWrapper text='Прохождение билета' subtitle=''>
                  <TicketPage />
                </ContentWrapper>
              </Body>
            </PrivateRoute>
            }  />
          </Route>
          
          <Route path="/new_ticket" element={
            <PrivateRoute>
              <Body>
              <LeftPanel isTest={false}/>
              <ContentWrapper text='Создание нового билета' subtitle=''>
                <NewTicket />
              </ContentWrapper>
            </Body>
            </PrivateRoute>
            } />
          <Route path='/result'>
            <Route path='/result/table' element={
              <PrivateRoute>
              <Body>
              <LeftPanel isTest={false}/>
              <ContentWrapper text='Таблица результатов' subtitle=''>
                <ResultTeable />
              </ContentWrapper>
            </Body>
              </PrivateRoute>
             } />
            <Route path='/result/:attempt_id' element={
              <PrivateRoute>
              <Body>
              <LeftPanel isTest={false}/>
              <ContentWrapper text='Результаты' subtitle=''>
                <ResultOfTicket />
              </ContentWrapper>
            </Body>
              </PrivateRoute>
              }/>
          </Route>
          <Route path='/history' element={
            <PrivateRoute>
              <Body>
                <LeftPanel isTest={false}/>
                <ContentWrapper text='История билетов' subtitle='' style={{maxHeight: '100vh;'}}>
                  <History />
                </ContentWrapper>
            </Body>
              </PrivateRoute>}/>
          <Route path='/contacts' element={
            <PrivateRoute>
              <Body>
                <LeftPanel isTest={false}/>
                <ContentWrapper text='Контакты' subtitle=''>
                  <Contacts />
                </ContentWrapper>
            </Body>
              </PrivateRoute>}/>
          <Route path='/exam' element={
            <PrivateRoute>
              <Body>
                <LeftPanel isTest={false}/>
                <ContentWrapper text='Экзамен' subtitle=''>
                  <Exam />
                </ContentWrapper>
            </Body>
              </PrivateRoute>}/>
          <Route path='/profile'>
            <Route path=':username' element={
               <PrivateRoute>
                <Body>
                <LeftPanel isTest={false}/>
                <ContentWrapper text='Профиль' subtitle=''>
                  <Profile />
                </ContentWrapper>
            </Body>
                </PrivateRoute>}/>
          </Route>
        </Routes>  
    </UserContextProvider>
  );
}


export default App;
