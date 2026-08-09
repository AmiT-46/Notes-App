import './App.css';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Hero from './pages/Hero/Hero';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const routes = (
  <Router>
    <Routes>
      <Route path='/' element={<Hero/>} />
      <Route path='/dashboard' exact element={<Home/>} />
      <Route path='/login' exact element={<Login/>} />
      <Route path='/signUp' exact element={<SignUp/>} />
    </Routes>
  </Router>
)

const App = ()=>{
  return (
    <div className="app">
      {routes}
    </div>
  )
}

export default App;
