import React, { useContext, useEffect } from 'react'
import Auth from '../context/Auth';

const Profile = () => {

    const {address} = useContext(Auth)

    const fun = async () => {
        const stk = "0x91CF787b441207e6faB4e18320521c3d23c587E3";
  
      const url = new URL(`https://api.covalenthq.com/v1/100/address/${address}/balances_v2/?key='ckey_bcf2a8cd82204dc3a01733fa007'&nft=true}`);
      const response = await fetch(url);
      const result = await response.json();
      const data = result.data.items;
      console.log(data);

      for (var i = 0; i < data.length; i++) {
        if(data[i]["contract_address"] === stk){//5$            
            console.log(data);
        }
        
      }
    }
    
    useEffect(() => {
        fun()
    }, [])

  return (
    <div>
      
    </div>
  )
}

export default Profile
