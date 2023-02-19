import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import Bg from '../../components/Bg_learner/Bg';
import { ethers } from 'ethers';
import Auth from '../../context/Auth';
import { Player } from '@livepeer/react';
import AOS from "aos";
import VidList from './VidList'
import abi from '../../abi.json'
import axios from 'axios';
import Header from './Header';
import poster from '../../assets/poster.jpg'

const contractAddress = "0x9DeFFaCA204161715EA3F2Af755f5632f80A7255";

const ExploreCourse = () => {

    const {checkAddress, setMainCid} = useContext(Auth)
    const [cVidList, setcVidList] = useState() // array
    const [courses, setCourses] = useState()

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const getDemoVid = async(id) => {
        const contractInstance = new ethers.Contract(contractAddress, abi, provider.getSigner());
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

    const getFilteredCourses = async (fields) => {
  
      let data2;

      if(fields.find((f) => { return f === 'Explore All'}) === 'Explore All'){
        data2 = await axios.get(`https://apisuperlearn.up.railway.app/api/course`)
      } else {
        data2 = await axios.post('https://apisuperlearn.up.railway.app/api/find_course', {
          filter:fields
        }, {
          headers : {'content-type': 'application/x-www-form-urlencoded'}
        })
      }
      
      let merge = data2.data
        for(let i=0;i<merge.length;i++){
            getDemoVid(merge[i]._id)
            .then(playbackId => {
                merge[i].playbackId = playbackId
            })
        }
        console.log(merge.playbackId);
        setCourses(merge)
        setcVidList('')
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
        <Header getFilteredCourses={getFilteredCourses} />
            
        <div className='dash_sec_cont'>
          <div className='dash_vids_list' data-aos="zoom-out-down">
            <h1 style={{"width":"100%", "fontSize":"20px","padding":"10px","marginTop":"0px","color":"black", "position":"sticky","top":"0","zIndex":"6","backdropFilter":"blur(20px)","background":"rgba(255, 255, 255, 0.5)", "borderRadius":"20px"}}>Explore courses</h1>
            {
                    (courses !== undefined && courses.length > 0) ? courses.map((data) => (
                        <div className='courses'>
                            <div className='vid_and_desc'>
                                <div className='demo_vid'>
                                    <Player 
                                        playbackId={data.playbackId}
                                        showTitle={false}
                                        showPipButton
                                        autoPlay={false}  
                                        poster={poster}
                                        showLoadingSpinner={true}   
                                        controls={true}  
                                        aspectRatio="16to9"
                                        objectFit="cover"
                                        theme={{
                                          borderStyles: {
                                            containerBorderStyle: 'hidden',
                                          },
                                          colors: {
                                            accent: '#B1DCFB',
                                          },
                                          space: {
                                            controlsBottomMarginX: '5px',
                                            controlsBottomMarginY: '-20px',
                                            controlsTopMarginX: '10px',
                                            controlsTopMarginY: '10px'
                                          },
                                          radii: {
                                            containerBorderRadius: '20px',
                                          },
                                        }}                               
                                    />
                                </div>                           
                                <div className='demo_desc'>
                                    <p>{data.cName}</p>
                                    <p>{data.cDesc}</p>
                                </div>
                            </div>
                            <button className='right_arr' onClick={() => setcVidList(data)}><i class='bx bxs-chevron-right icons'  onClick={() => setMainCid(data)}></i></button>
                        </div>
                    )) : <p>No courses available now!</p>
                }
          </div>
          <VidList data={cVidList} />
            
        </div>

    </div>
  )
}
// executeBatchCall(5, '0xBD321B81555f35478e1BA52fb5AF3E912366aB19', 100000000000000)

export default ExploreCourse
