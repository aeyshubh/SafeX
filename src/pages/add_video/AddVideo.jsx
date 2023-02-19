import React, {  useContext, useEffect } from 'react'
import logo from '../../assets/logo2.png'
import Bg from '../../components/Bg_learner/Bg'
import './style.css'
import { useCreateAsset } from '@livepeer/react';
import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { ethers } from 'ethers';
import abi from '../../abi.json'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Auth from '../../context/Auth';

const contractAddress = "0x9DeFFaCA204161715EA3F2Af755f5632f80A7255";

const AddVideo = () => {
  
    const navigate = useNavigate()
    const [video, setVideo] = useState();
    const [cName, setName] = useState('')
    const {mainCid} = useContext(Auth)
  
    const {
        mutate: createAsset,
        data: asset,
        status,
        progress,
        error,
      } = useCreateAsset(
        video
          ? {
              sources: [{ name: video.name, file: video }]
            }
          : null,
      );
        
      const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
          setVideo(acceptedFiles[0]);
        }
      }, []);
    
      const { getRootProps, getInputProps } = useDropzone({
        accept: {
          'video/*': ['*.mp4'],
        },
        maxFiles: 1,
        onDrop,
      });
    
      const progressFormatted = useMemo(
        () =>
          progress?.[0].phase === 'failed'
            ? 'Failed to process video.'
            : progress?.[0].phase === 'waiting'
            ? 'Waiting'
            : progress?.[0].phase === 'uploading'
            ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
            : progress?.[0].phase === 'processing'
            ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
            : null,
        [progress],
      );
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    
      const submit = async (e) => {
        e.preventDefault()
        
        toast.loading(`Your video has been creating, Don't close tab`, {
          toastId:1
        });
        
        
      }
      
      const mint = async () => {
        if(asset?.[0]?.playbackId){
          const signer = provider.getSigner()
          const contractInstance = new ethers.Contract(contractAddress, abi, signer);
          console.log("Minting!!");
          
          try {
            await contractInstance
            .setCourseCreator(mainCid._id, asset[0].playbackId, cName, Date.now())
            .then((res) => {
              // console.log(res);
              toast.dismiss(1);
              toast.success(`Video created successfully`, {
                position: toast.POSITION.TOP_RIGHT
              });
              navigate('/dashboard')
            })
    
          } catch (err) {
            console.log(err);
          }
        }
      }
    
      useEffect(() => {
        mint()
      })
  
    return (
        <div className='create_co'>
        <div className="img-search">
            <img
            src={logo}
            alt=""
            />
        </div>
        <form className='co_form' onSubmit={submit}>
            <input type='text' placeholder='Video title' onChange={(e) => setName(e.target.value)} />
            <>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className='drag'>Drag and drop or browse files</p>
              </div>
              {error?.message && <p>{error}</p>}
        
              {video && <p>{video.name}</p>}
              {progressFormatted && <p>{progressFormatted}</p>}
        
              <h1>{asset?.[0]?.playbackId && asset[0].playbackId  }</h1>

              
            </>
            <div className="join">
              <button
                  onClick={() => {
                    createAsset?.();
                  }}
                  type='submit'
                  disabled={!createAsset || status === 'loading'}
                >
                Create & Add
              </button>
            </div>
        </form>
        <Bg />
    </div>
    )
}

export default AddVideo