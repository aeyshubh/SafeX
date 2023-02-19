import React, { useContext, useEffect, useState } from 'react'
import logo from '../../assets/logo2.png'
import { Link, useNavigate } from 'react-router-dom'
import { ethers } from 'ethers';
import abi from '../../abi.json'
import './style.css'
import {
  Player
} from "@livepeer/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Auth from '../../context/Auth';
import { toast } from 'react-toastify';
import axios from 'axios';
import poster from '../../assets/poster.jpg'
import Bg from '../../components/Bg_creator/Bg'
import VidList from './VidList';
import AOS from "aos";

const contractAddress = "0x9DeFFaCA204161715EA3F2Af755f5632f80A7255";

const CreatorDashboard = () => {

    const {checkAddress, address,setMainCid} = useContext(Auth)
    const [courses, setCourses] = useState()
    const [cVidList, setcVidList] = useState() // array


    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const getDemoVid = async(id) => {
        const contractInstance = new ethers.Contract(contractAddress, abi, provider.getSigner());
      try {
        const playbackId = await contractInstance.getVideos(id)
        console.log(playbackId[0]);
        return playbackId[0]
      } catch (err) {
        console.log(err);
      }
    }  

    const getCourse = async () => {
        const data = await axios.get(`https://apisuperlearn.up.railway.app/api/course?wAddress=${address}`)
        let merge = data.data
        for(let i=0;i<merge.length;i++){
            getDemoVid(merge[i]._id)
            .then(playbackId => {
                merge[i].playbackId = playbackId
            })
        }
        setCourses(merge)
    }

    useEffect(() => {
        checkAddress()
        getCourse()
    }, [])

    useEffect(() => {
      AOS.init();
    }, []);

  return (
    <div className='dash_cont'>
        <Bg />
        <div className="dash_header">
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
                        <p className="btn from-top">home</p>
                    </Link>
                </li>
                <li>
                    <Link to="/create_course">
                        <p className="btn from-top">create course</p>
                    </Link>
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

        <div className='dash_sec_cont'>
            <div className='dash_vids_list' data-aos="zoom-out-down">
            <h1 style={{"width":"100%", "fontSize":"20px","padding":"10px","marginTop":"0px","color":"black", "position":"sticky","top":"0","zIndex":"6","backdropFilter":"blur(20px)","background":"rgba(255, 255, 255, 0.5)", "borderRadius":"20px"}}>My courses</h1>
                {
                    courses !== undefined && courses.map((data) => (
                        <div className='courses'>
                            <div className='vid_and_desc'>
                                <div className='demo_vid'>
                                    <Player 
                                        playbackId={data.playbackId}
                                        showTitle={false}
                                        showPipButton
                                        poster={poster}
                                        autoPlay={false}  
                                        objectFit="cover"
                                        theme={{
                                          borderStyles: {
                                            containerBorderStyle: 'hidden',
                                          },
                                          colors: {
                                            accent: '#B1DCFB',
                                          },
                                          radii: {
                                            containerBorderRadius: '20px',
                                          },
                                        }}
                                        // showLoadingSpinner={false}                                    
                                    />
                                </div>                           
                                <div className='demo_desc'>
                                    <p>{data.cName}</p>
                                    <p>{data.cDesc}</p>
                                </div>
                            </div>
                            <button className='right_arr' onClick={() => setcVidList(data)}><i class='bx bxs-chevron-right icons'  onClick={() => setMainCid(data)}></i></button>
                        </div>
                    ))
                }
            </div>
            <VidList data={cVidList} />
            
        </div>


    </div>
  )
}

export default CreatorDashboard
