import React, {useState, useEffect} from 'react'
import './style.css'
import { BrowserRouter as Router, Switch, Route,Routes, Link } from 'react-router-dom';


export const BoxPages = () => {
  return (
    <div className='container'>
        <button className='button-link'>
            <Link to='/' className='button-start'>
                Home
            </Link>
        </button>
        <button className='button-link'>
            <Link to='/inputs' className='button-start'>
                Input
            </Link>
        </button>
    </div>
  )
}
