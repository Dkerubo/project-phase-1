import React from 'react'
import '../css/navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div>
      <nav>
        <ul>
            <li>
                <Link to="/home">Home</Link>
            </li>
            <li>
                <Link to="/about">About</Link>
            </li>
            <li>
                <Link to="/contact">Contact</Link>
            </li>
            <li>
                <Link to="/click">Clicktracker</Link>
            </li>
            <li>
                <Link to="/count">Counttracker</Link>
            </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar