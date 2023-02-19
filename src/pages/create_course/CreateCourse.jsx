import React, { useContext, useEffect } from 'react'
import logo from '../../assets/logo2.png'
import Bg from '../../components/Bg_learner/Bg'
import './style.css'
import { useCreateAsset } from '@livepeer/react';
import { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Auth from '../../context/Auth';
import axios from 'axios';
import { ethers } from 'ethers';
import abi from '../../abi.json'
import { Select } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as PushAPI from "@pushprotocol/restapi";

const contractAddress = "0x9DeFFaCA204161715EA3F2Af755f5632f80A7255";

const options = [
  {value:'Art & Huminity',label:'Art & Huminity'}, 
  {value:'Business',label:'Business'}, 
  {value:'Health',label:'Health'}, 
  {value:'Computer science',label:'Computer science'},
  {value:'Math & logic',label:'Math & logic'},
  {value:'Personal Development',label:'Personal Development'},
  {value:'Explore All',label:'Explore All'}
]
                      

const CreateCourse = () => {
  
  const navigate = useNavigate()
  const [video, setVideo] = useState();
  const [cName, setName] = useState('')
  const [cfield, setField] = useState('')
  const [cOut, setOut] = useState('')
  const [desc, setDesc] = useState('')
  const {address} = useContext(Auth)

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
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}`
        : progress?.[0].phase === 'processing'
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}`
        : null,
    [progress],
  );

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const submit = async (e) => {
    e.preventDefault()
    
    toast.loading(`Your course has been creating, don't close the tab`, {
      toastId:1
    });

    let date = new Date()
    date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
    const data2 = await axios.post('https://apisuperlearn.up.railway.app/api/create_course', {
      walletAddress: address,
      cName: cName,
      cDesc: desc,
      cField: cfield,
      cDate: date,
      cOutcomes: cOut
    }, {
      headers : {'content-type': 'application/x-www-form-urlencoded'}
    })
    console.log(data2);
    
  }
  
  const mint = async () => {
    if(asset?.[0]?.playbackId){

      const signer = provider.getSigner()
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      console.log("Minting!!");
      
      try {

        const data = await axios.get('https://apisuperlearn.up.railway.app/api/count')
        let counter = data.data[0].seq + 1
        
        console.log(asset[0].playbackId);

        let date = Date.now();
        await contractInstance
        .setCourseCreator(Number(counter), asset[0].playbackId, cName, date)
        .then((res) => {
          toast.dismiss(1);
          toast.success(`Course created successfully`, {
            position: toast.POSITION.TOP_RIGHT
          });
      
            PushAPI.payloads.sendNotification({
              signer,
              type: 1, // broadcast
              identityType: 2, // direct payload
              notification: {
                title:cName, //Notification pops just for some time
                body:desc, //Nptification pops for
              },
              payload: {
                title:cName, //Notification pops just for some time
                body:desc, // Main Test shown on the page
                cta: "",
                img: "",
              },
              channel: `eip155:5:${address}`,
              env: "staging",
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
            <input type='text' placeholder='Course name' onChange={(e) => setName(e.target.value)} />
            <Select
              mode="tags"
              placeholder='Select course Field'
              onChange={(value) => setField(value)}
              options={options}
              className='select'
            />
            <input type='text' placeholder='Course outcomes' onChange={(e) => setOut(e.target.value)} />
            <input type='text' placeholder='Description' onChange={(e) => setDesc(e.target.value)} />

            <>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className='drag'>{video ? video.name : "Drag and drop or browse files"}
                <br />
                {progressFormatted && progressFormatted}
                </p>
                
              </div>    
            </>

            <div className="join">
              <button
                  onClick={() => {
                    createAsset?.();
                  }}
                  type='submit'
                  disabled={!createAsset || status === 'loading'}
                >
                Create
              </button>
            </div>
        </form>
        <Bg />
    </div>
  )
}

export default CreateCourse
