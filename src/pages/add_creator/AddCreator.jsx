import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import Bg from '../../components/Bg_creator/Bg'
import logo from '../../assets/logo2.png'
import Auth from '../../context/Auth'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const AddCreator = () => {
  
  const navigate = useNavigate()
  
  const {address} = useContext(Auth)
  const [name, setName] = useState('')
  const [iName, setIname] = useState('')
  const [exp, setExp] = useState('')
  const [sSub, setSsub] = useState('')
  const [img, setImg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    toast.loading(`Account has been creating`, {
      toastId:1
    });
    const data = await axios.post('https://apisuperlearn.up.railway.app/api/reg_teacher', {
      walletAddress: address,
      tName: name,
      tInstName: iName,
      tSpecialised: sSub,
      tExperience: Number(exp),
      tPhoto: img
    }, {
      headers : {'content-type': 'application/x-www-form-urlencoded'}
    })
    console.log(data);
    toast.dismiss(1);
    toast.success(`Account created successfully`, {
      position: toast.POSITION.TOP_RIGHT
    });
    navigate('/dashboard')

  }

  return (
    <div className='add_creator'>
        <div className="img-search">
            <img
            src={logo}
            alt=""
            />
        </div>
        <form className='creator_form' onSubmit={submit} >
            <input type='text' placeholder='Name' onChange={(e) => setName(e.target.value)} />
            <input type='text' placeholder='Institute name (optional)' onChange={(e) => setIname(e.target.value)} />
            <input type='text' placeholder='Experience' onChange={(e) => setExp(e.target.value)} />
            <input type='text' placeholder='Specialized subjects' onChange={(e) => setSsub(e.target.value)} />
            <div className="join">
                <button type='submit'>Join</button>
            </div>
        </form>
      <Bg />
    </div>
  )
}

export default AddCreator
