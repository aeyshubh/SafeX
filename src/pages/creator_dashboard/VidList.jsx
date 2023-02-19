import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import abi from '../../abi.json'
import { ethers } from 'ethers';
import { Player } from '@livepeer/react';
import AOS from "aos";

const contractAddress = "0x9DeFFaCA204161715EA3F2Af755f5632f80A7255";

const VidList = ({data}) => {
  
    const [vid, setVids] = useState()
    const [fields, setFields] = useState()

    const render = async  () => {
        try {
          console.log(data);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
        
            const contractInstance = new ethers.Contract(contractAddress, abi, signer);

            contractInstance.getVideos(data._id)
            .then(playbackId => {
              console.log(playbackId);
              // setId(playbackId)
              contractInstance.getCourseTitle(data._id)
              .then(t => {
                // setTitle(t)
                let arr = []
                // console.log(data._id+" "+playbackId+" "+t)
                for(let i=1;i<t.length;i++){
                  arr.push({id:playbackId[i],title:t[i]})
                }
                console.log(arr);
                setVids(arr)
              })
            })
            
          } catch (err) {
            console.log(err);
          }
    }
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };
  
    const onReady = (event) => {
      // access to player in all event handlers via event.target
      event.target.pauseVideo();
    };

    useEffect(() => {     
      if(data !== undefined){
        render()
        setFields(data.cField)
      }   
    }, [data])

    useEffect(() => {
      AOS.init();
    }, []);

  return (
    <>
         {
            data && (
            <div className='dash_vid'>
                <div className='add' data-aos="fade-up" data-aos-anchor-placement="center-bottom">
                  <div className='info'>
                      <p>{data.cName}</p>
                      <p>{data.desc}</p>
                      <div className='fields'>
                        {
                          fields !== undefined && fields.map((d) => (
                            <span>{d}</span>
                          ))
                        }
                      </div>
                  </div>
                  <div className='two_btn'>
                      <button><i class='bx bx-play-circle icons' ></i> Live stream</button>
                      <Link to='/add_vid'><button><i class='bx bx-plus icons'></i>Add video</button></Link>            
                  </div>
                </div>
                <h1 style={{"width":"100%", "fontSize":"20px","padding":"10px","marginTop":"20px","color":"black"}}>Included Videos</h1>
                <div className='v_cont'>
                    {
                      vid && vid.map((d) => (
                        <div className='vid_cont'>
                            <Player 
                                playbackId={d.id}
                                showLoadingSpinner
                                showTitle
                                controls={{ autohide: 1, hotkeys: false }}
                                aspectRatio="16to9"
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
                            />
                          <p className='w-full ml-12'>
                            <hr className='mt-4 w-full' />
                            {d.title}</p>                   
                        </div>
                      ))
                    }
                </div>
            </div>
            )
        }
    </>
  )
}

export default VidList
