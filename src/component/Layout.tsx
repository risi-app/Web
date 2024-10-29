import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import HandControl from './HandControl';
import './Layout.css';

function Layout() {
    const [isLeftBarVisible, setIsLeftBarVisible] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1600) {
                setIsLeftBarVisible(false);
            } else {
                setIsLeftBarVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="body_home">
            <button 
                className="toggle-button left-toggle" 
                onClick={() => setIsLeftBarVisible(!isLeftBarVisible)}
            >
                {isLeftBarVisible ? "X" : "☰"}
            </button>

            <div className='top_bar'>
                <Link to="/home">RISI</Link>
            </div>

            <div className={`left_bar ${isLeftBarVisible ? 'visible' : 'hidden'}`}>
                <div className="left_bar_top">
                    <Link to="/home" onClick={() => setIsLeftBarVisible(false)}><h1>RISI</h1></Link>
                    <p className='welcome_message'>Welcome, {localStorage.getItem('user')}!</p>
                    <Link to="/add" onClick={() => setIsLeftBarVisible(false)}><h2>Add</h2></Link>
                    <Link to={`/profile/${localStorage.getItem('user')}`} onClick={() => setIsLeftBarVisible(false)}><h2>Profile</h2></Link>
                    {/* <HandControl/> */}
                </div>
                <div className="left_bar_bottom">
                    <Link to="/login" onClick={() => setIsLeftBarVisible(false)}><h2>Logout</h2></Link>
                </div>
            </div>

            <div className={`right_bar ${isLeftBarVisible ? 'visible' : 'hidden'}`}>
                <div className="right_bar_top">
                    <HandControl/>
                </div>
            </div>

            <div className="middle_content">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
