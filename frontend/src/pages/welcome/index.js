import React, { useEffect } from 'react'
import axios from "axios";
import styled from 'styled-components'
import home from '../../images/home.jpg'
import ucn from '../../images/ucn.png'
import cii from '../../images/logo-cii.png'
import vct from '../../images/vct.png'
import {Link}  from 'react-router-dom'
import './style.css';



export const Welcome = () => {
  
  return (
    <div className='background-home'>
      <div className='home-container'>
        <div className='logos'>
          <img src={cii} className='cii-logo'/>
          <img src={ucn} className='ucn-logo'/>
        </div>
        <div className='welcome-container'>
          <h1 className='welcome-text'>BIENVENIDO</h1>
          <div className='empresa'>
            <img src={vct} className='vct-logo'/>
          </div>
          <button className='button-home'>
            <Link to ='/inputs' className='button-next'>
              <h3>Iniciar</h3>
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
};
