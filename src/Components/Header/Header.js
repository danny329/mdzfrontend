import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <div className="Header">
            <Link className="linka" to="/">Home</Link>
            <Link className="linka" to="/persons">Create</Link>
        </div>
    )
}

export default Header
