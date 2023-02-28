import React, {useState} from 'react'
import { abi } from '../contract';
import { Contract, ethers } from 'ethers';
import { useEffect } from 'react';
import './style.scss'

const Sell = () => {

    const [salary,setSalary] = useState('');
    const [duration,setDuration] = useState('');
    const [price,setPrice] = useState('');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0x9754c9969705b3d60e7890416F515c2EDef8B1c0';
    const contractABI = abi;
    // const contractRead = new Contract(
    //     contractAddress,
    //     contractABI,
    //     provider
    // );
    const contractWrite = new ethers.Contract(contractAddress, contractABI, signer);

    const submit = async (e) => {
        e.preventDefault()
        await contractWrite.setSalaryInfo(salary, duration, ethers.utils.parseEther(price)).then(res => console.log(res) ) 
    }

  return (
    <div className='bg'>
      <h1>Sell Cashflow NFTs</h1><br /><br />
      <form class="form">
        <div class="form__field">
          <div class="input-group">
            <label class="input-group__label">Salary</label>
            <input type="text" class="input-group__input" onChange={e=>setSalary(e.target.value)}></input> 
          </div>
          <div class="input-group">
            <label class="input-group__label">Duration</label>
            <input type="text" class="input-group__input" onChange={e=>setDuration(e.target.value)}></input>
          </div>
          <div class="input-group">
            <label class="input-group__label">Price</label>
            <input type="text" class="input-group__input" onChange={e=>setPrice(e.target.value)}></input>
          </div>
          <button onClick={submit} className='butto' type='button'>Sell</button>
        </div>
      </form>
      </div>
  )
}

export default Sell
