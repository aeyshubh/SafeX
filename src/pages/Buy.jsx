import React, {useState} from 'react'
import { abi } from '../contract';
import { Contract, ethers } from 'ethers';
import { useEffect } from 'react';

const Buy = () => {
  
    const [allData,setData] = useState('');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0x9754c9969705b3d60e7890416F515c2EDef8B1c0';
    const contractABI = abi;
    const contractRead = new Contract(
        contractAddress,
        contractABI,
        provider
    );
    const contractWrite = new ethers.Contract(contractAddress, contractABI, signer);

    const submit = async () => {
        const data = await contractRead.index()
        let arr = []
        for(let i=0;i<Number(data);i++){
          const j = await contractRead.salaryMapping(i)
          // console.log(j);
          console.log(Number(j.duration));
          arr.push({index: i,price: ethers.utils.formatEther(Number(j.price)), duration:Number(j.duration), seller: j.seller, salaryAmount: Number(j.salaryAmount), boughtBy: j.buyer})
        }
        setData(arr)
    }

    const buy = async (i, price) => {
      // console.log(i);
      price = ethers.utils.parseEther(price)
      await contractWrite.buyBond(i, {value:price}).then(res => console.log(res)) 
    }

    useEffect(() => {
      submit()
    }, [])

  return (
    
    <div className='bg'>
      <h1>Buy Cashflow NFTs</h1><br /><br />
      {
        allData && allData.map(data => (           
          <>
            <div className='form'>
              <p>salaryAmount : {data.salaryAmount}</p>
              <p>Price : {data.price}</p>
              <p>Duration : {data.duration}</p>
              <br />
              {
                data.boughtBy === '0x0000000000000000000000000000000000000000'
                ? <button className="butto" onClick={() => buy(data.index, data.price)}>Buy</button>
                : <p>Bought by : {data.boughtBy}</p>
              }              
            </div>
            <br />
          </>
        ))
      }
      
    </div>
    
  )
}

export default Buy
