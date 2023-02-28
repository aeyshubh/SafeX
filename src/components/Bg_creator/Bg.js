import React from 'react'
import vid from '../../assets/bg2.mp4'
import './style.css'

const Bg = () => {
  return (
    <video autoPlay id="myVideo">
      <source autoPlay src={vid} type="video/mp4" /> 
    </video>
  )
}

export default Bg

