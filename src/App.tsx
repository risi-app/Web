import './App.css'
import Home from './component/Home'
import Login from './component/Login'
import { Route, Routes } from 'react-router-dom'
import Signin from './component/Signin'
import Layout from './component/Layout'
import Add from './component/Add'
import Profile from './component/Profile'
import Detail from './component/Detail'
import HandControl from './component/HandControl'

function App() {

    return (
        <>
            {/* <HandControl/> */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index path="/home" element={<Home />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/profile/:id" element={<Profile />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signin" element={<Signin />} />
            </Routes>
        </>
    )
}

export default App
