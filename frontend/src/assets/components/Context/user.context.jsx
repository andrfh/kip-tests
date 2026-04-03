import { createContext, useState } from 'react';

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    username: '',
    first_name: '',
    last_name: '',
    surname: '',
    role: '',
    group: ''
  });
  const [questions, setQuestions] = useState();
  const [attemptInfo, setAttemptInfo] = useState(
    {
      totalTime: 0,
      seconds: 0,
      question_id: 0,
      points: 0,
      subject: '',
      answers: []
    }
  );
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  let token = localStorage.getItem('t')

  return (
    <UserContext.Provider value={{ user, setUser, questions, setQuestions, token, attemptInfo, setAttemptInfo, open, setOpen, detailsOpen, setDetailsOpen}}>
      {children}
    </UserContext.Provider>
  );
};
