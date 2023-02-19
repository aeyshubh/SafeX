import React, {useEffect, useState} from 'react'
import abi from '../../abi.json'
import { ethers } from 'ethers';
import { Player } from '@livepeer/react';
import AOS from "aos";

const VidList = ({data}) => {
    
    const [id, setId] = useState()
    const [title, setTitle] = useState()

    const contractAddress = "0x71259CFB8eb44748786c6eb6b53e20257699F6A8";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
      const wallet = new ethers.Wallet(
        "0x1165ce763fc573560f2132a5081abfe4e73a1212711a5a5126677f85ac3cd0f8",
        provider
      );

    const contractInstance = new ethers.Contract(contractAddress, abi, wallet);

    const render = async  () => {
        try {
            console.log(data);
            const playbackId = await contractInstance.getVideos(data._id)
            const t = await contractInstance.getCourseTitle(data._id)
            setId(playbackId)
            setTitle(t)
            console.log(playbackId);
            console.log(t);
          } catch (err) {
            console.log(err);
          }
    }

    useEffect(() => {
        render()
    }, [])

    useEffect(() => {
      AOS.init();
    }, []);

  return (
    <>

         {
            data && (
            <div className='dash_vid'>
                <div className='add' data-aos="fade-up" data-aos-anchor-placement="center-bottom">
                  <p>{data.cName}</p>
                  <div className='two_btn'>
                      <button>End course</button> 
                  </div>
                </div>
                <h1 style={{"width":"100%", "fontSize":"20px","padding":"10px","marginTop":"20px","color":"black"}}>Included Videos</h1>
                <div className='v_cont'>
                  <div className='vid_cont'>
                      <div className='vid'>
                        <Player 
                            playbackId=""
                            showLoadingSpinner
                            showTitle
                            showPipButton
                            controls={false}
                        />
                      </div>
                      <p>{data._id}</p>
                      <p>desc</p>
                  </div>
                  <div className='vid_cont'>
                      <div className='vid'>
                        <Player 
                            playbackId=""
                            showLoadingSpinner
                            showTitle
                            showPipButton
                            controls={false}
                        />
                      </div>
                      <p>{data._id}</p>
                      <p>desc</p>
                  </div>
                  <div className='vid_cont'>
                      <div className='vid'>
                        <Player 
                            playbackId=""
                            showLoadingSpinner
                            showTitle
                            showPipButton
                            controls={false}
                        />
                      </div>
                      <p>{data._id}</p>
                      <p>desc</p>
                  </div>
                </div>
            </div>
            )
        }
    </>
  )
}

export default VidList
