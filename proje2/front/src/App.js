import { Route, Routes } from 'react-router-dom';
import './assets/styles.css';
import Header from './components/layout/header/Header';
import Home from './pages/home/Home';
import { useDispatch, useSelector } from 'react-redux';

import { BASE_URL } from './config';
import { useEffect } from 'react';
import { setCoins, setFilteredCoins, setSigned, setUser } from './redux/slice';
import Filtered from './pages/filtered/Filtered';
import Coin from './pages/coin/Coin';
import Register from './pages/register/Register';
import Login from './pages/login/Login';

function App() {
  const { coins } = useSelector(state => state.coin)
  const dispatch = useDispatch()
  const getCoins = async () => {
    try {
      const response = await fetch(`${BASE_URL}/coins`)
      const data = await response.json()
      dispatch(setCoins(data))
      dispatch(setFilteredCoins(data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCoins()
    const data = JSON.parse(localStorage.getItem('coinData'))
    if(data){
      dispatch(setSigned(true))
      dispatch(setUser(data))
    }
  }, [])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/filtered' element={<Filtered />} />
        <Route path='/coins/:id' element={<Coin />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
