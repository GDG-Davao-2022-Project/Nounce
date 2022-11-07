import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Compose from './pages/Compose';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Test from './pages/Test';
import './App.scss';

import React, { useRef, useState } from 'react';
import {auth} from './firebase-config';

function App() {
  return (
    <Router>  
      <div className="App">
        <Routes>
          <Route path='/' element={< Home />}></Route>
          <Route path='/login' element={< Login />}></Route>
          <Route path='/compose' element={<Compose/>}></Route>          
          <Route path='/settings' element={<Settings/>}></Route>
          <Route path='/chat/:id' element={<Chat/>}></Route>
          <Route path='/test' element={< Test />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
