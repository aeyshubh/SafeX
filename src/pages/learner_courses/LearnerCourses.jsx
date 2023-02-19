import React, { useContext, useEffect, useState } from 'react'
import Bg from '../../components/Bg_learner/Bg';
import { ethers } from 'ethers';
import { Framework } from "@superfluid-finance/sdk-core";
import Auth from '../../context/Auth';
import { Player } from '@livepeer/react';
import AOS from "aos";
import abi from '../../abi.json'
import axios from 'axios';
import Header from '../explore_courses/Header';
import VidList from './VidList';
import poster from '../../assets/poster.jpg'

const LearnerCourses = () => {
    const {checkAddress, setMainCid} = useContext(Auth)
    const [cVidList, setcVidList] = useState() // array
    const [courses, setCourses] = useState()

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const wallet = new ethers.Wallet(
        "0x1165ce763fc573560f2132a5081abfe4e73a1212711a5a5126677f85ac3cd0f8",
        provider
    );
    const contractAddress = "0x71259CFB8eb44748786c6eb6b53e20257699F6A8";

    const getDemoVid = async(id) => {
        const contractInstance = new ethers.Contract(contractAddress, abi, wallet);
      try {
        const playbackId = await contractInstance.getVideos(id)
        return playbackId[0]
      } catch (err) {
        console.log(err);
      }
    }  

    const getCourse = async () => {
        const data = await axios.get(`https://apisuperlearn.up.railway.app/api/course`)
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
    <div className='e_cont'>
        <Bg />
        <Header />
            
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

export default LearnerCourses