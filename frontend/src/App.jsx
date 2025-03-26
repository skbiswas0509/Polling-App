import React from 'react'
import {BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import LoginForm from './pages/Auth/LoginForm'
import SignUpForm from './pages/Auth/SignUpForm'
import Home from './pages/Dashboard/Home'
import CreatePoll from './pages/Dashboard/CreatePoll'
import MyPoll from './pages/Dashboard/MyPoll'
import VotedPolls from './pages/Dashboard/VotedPolls'
import Bookmarks from './pages/Dashboard/Bookmarks'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root/>}/>
          <Route path='/login' exact element={<LoginForm />}/>
          <Route path='/signup' exact element={<SignUpForm/>}/>
          <Route path='/dashboard' exact element={<Home/>}/>
          <Route path='/create-poll' exact element={<CreatePoll/>}/>
          <Route path='/my-poll' exact element={<MyPoll/>}/>
          <Route path='/voted-Poll' exact element={<VotedPolls/>}/>
          <Route path='/bookmarked-polls' exact element={<Bookmarks/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App

//define the root component to handle the initial redirect

const Root = ()=>{
  //check if the token exists tin the local storgae 
  const isAuthenticated = !!localStorage.getItem("token")

  //redirect to dashboard if authenticated otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="login" />
  )
}