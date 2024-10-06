import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
    const [isTopBarVisible, setIsTopBarVisible] = useState(true);
    const [isLeftBarVisible, setIsLeftBarVisible] = useState(true);
    // const [isRightBarVisible, setIsRightBarVisible] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1600) {
                setIsLeftBarVisible(false);
            } else {
                setIsLeftBarVisible(true);
            }

            if (window.innerWidth > 900) {
                setIsTopBarVisible(false);
            } else {
                setIsTopBarVisible(true);
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
                {isLeftBarVisible == true ? "X" : "☰"}
            </button>

            <div className={`top_bar ${isTopBarVisible ? 'visible' : 'hidden'}`}>
                <Link to="/home">RISI</Link>
            </div>

            <div className={`left_bar ${isLeftBarVisible ? 'visible' : 'hidden'}`}>
                <div className="left_bar_top">
                    <Link to="/home" onClick={() => setIsLeftBarVisible(!isLeftBarVisible)}><h1>RISI</h1></Link>
                    <br/>
                    <p>Welcome, {localStorage.getItem('user')}!</p>
                    <Link to="/add" onClick={() => setIsLeftBarVisible(!isLeftBarVisible)}><h2>Add</h2></Link>
                    <Link to={`/profile/${localStorage.getItem('user')}`} onClick={() => setIsLeftBarVisible(!isLeftBarVisible)}><h2>Profile</h2></Link>
                </div>
                <div className="left_bar_bottom">
                    <Link to="/login" onClick={() => setIsLeftBarVisible(!isLeftBarVisible)}><h2>Logout</h2></Link>
                </div>
            </div>

            <div className="middle_content">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
