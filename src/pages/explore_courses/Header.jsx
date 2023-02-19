import React, { useState } from 'react'
import logo from '../../assets/logo2.png'
import { Link } from "react-router-dom";
import './style.css'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Select } from 'antd';

const Header = ({getFilteredCourses}) => {

    const [field, setField] = useState()

  return (
    <div className="e_header">
            <div className="img-search">
                <img
                src={logo}
                alt=""
                />
            </div>

            <div className="nav">
                <ul>
                <li>
                    <Link to="/">
                    <p className="btn from-top">Home</p>
                    </Link>
                </li>
                <li>
                    <Link to="/explore">
                    <p className="btn from-top">Explore courses</p>
                    </Link>
                </li>
                <li>
                    <Link to="/learner_courses">
                    <p className="btn from-top">My courses</p>
                    </Link>
                </li>
                <li>
                    <Link>
                    <p className="btn from-top">NFT collection</p>
                    </Link>
                </li>
                <li className='select_comp'>
                    <Select
                        mode="tags"
                        placeholder='Filter courses'
                        onChange={(value) => setField(value)}
                        options={[
                            {value:'Art & Huminity',label:'Art & Huminity'}, 
                            {value:'Business',label:'Business'}, 
                            {value:'Health',label:'Health'}, 
                            {value:'Computer science',label:'Computer science'},
                            {value:'Math & logic',label:'Math & logic'},
                            {value:'Personal Development',label:'Personal Development'},
                            {value:'Explore All',label:'Explore All'}
                          ]}
                        className='select'
                    />
                    <button onClick={() => getFilteredCourses(field)}><i class='bx bx-search-alt-2 icon' ></i></button>
                </li>

                {/* { 
                    !walletAddress 
                    ? <li><button onClick={connectWallet}><p style={{padding:"7px 5px"}}>Connect wallet</p></button></li>
                    : <li><Link to="/account"><p className="metamask" title={walletAddress}><i class="fa-solid fa-user"></i></p></Link></li>
                }   */}
                
                </ul>
            </div>
            <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} /> 
        </div>
  )
}

export default Header