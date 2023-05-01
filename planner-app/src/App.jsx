
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Admin from './components/Admin'
import Home from './components/Home'
import NotFound from './components/NotFound'
function App() {

  return (
    <>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/admin' element={<Admin />} />
        <Route exact path='/home' element={<Home />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App
