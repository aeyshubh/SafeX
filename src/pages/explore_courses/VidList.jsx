import React, {useContext, useEffect, useState} from 'react'
import abi from '../../abi.json'
import { ethers } from 'ethers';
import { Player } from '@livepeer/react';
import AOS from "aos";
import  './style.css'
import logo from '../../assets/logo.jpeg'
import { Chat } from "@pushprotocol/uiweb";
import Auth from '../../context/Auth';
import { Framework } from "@superfluid-finance/sdk-core";
import * as PushAPI from "@pushprotocol/restapi";

const VidList = ({data}) => {

  const {address} = useContext(Auth)
    
  const [vid, setVids] = useState()
  const [fields, setFields] = useState()
  const [stuC, setStuC] = useState()

    const contractAddress = "0x9DeFFaCA204161715EA3F2Af755f5632f80A7255";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractInstance = new ethers.Contract(contractAddress, abi, provider.getSigner());

    async function executeBatchCall(upgradeAmt, recipient, flowRate) {
      var accounts;
      if(window.ethereum){
          try {   
          accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
          });
          console.log(accounts)           
          } catch (error) {
              console.log(error)
          }
      }
      const sf = await Framework.create({
          chainId: 5,
          provider: provider
        });
      //   const chainId = await window.ethereum.request({ method: "eth_chainId" });
        const signer = provider.getSigner();
      
        const DAIx = await sf.loadSuperToken(
          "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00"
        );
    
        try {
          const amtToUpgrade = ethers.utils.parseEther(upgradeAmt.toString());
          const upgradeOperation = DAIx.upgrade({
            amount: amtToUpgrade.toString()
          });
          //upgrade and create stream at once
          const createFlowOperation = DAIx.createFlow({
            sender: accounts[0],
            receiver: recipient,
            flowRate: flowRate
          });
      
          console.log("Upgrading tokens and creating stream...");
      
            await sf
            .batchCall([upgradeOperation, createFlowOperation])
            .exec(signer)
            .then(function (tx) {
              console.log(
                `Congrats - you've just successfully executed a batch call!
                You have completed 2 operations in a single tx 🤯
                View the tx here:  https://goerli.etherscan.io/tx/${tx.hash}
                View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
                Network: Goerli
                Super Token: DAIx
                Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
                Receiver: ${recipient},
                FlowRate: ${flowRate}
                `
              );
              //Add a push Notification here
            });
    
            await PushAPI.channels.subscribe({
              signer: signer,
              channelAddress: `eip155:5:${recipient}`, // channel address in CAIP
              userAddress: `eip155:5:${address}`, // user address in CAIP
              onSuccess: () => {
                console.log("opt in success");
              },
              onError: () => {
                console.error("opt in error");
              },
              env: "staging",
            });

            await contractInstance
            .courseTakenByStudent(address, data._id)
            .then((res) => {
              console.log("course has been taken", res);
            })
      
        } catch (error) {
          console.log(
            "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
          );
          console.error(error);
        }
    }

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

    useEffect(() => {
        if(data !== undefined) {
          console.log(data.walletAddress);
          render()
          // getStudentcourses()
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
                    <p>{data.cDesc}</p>
                    <div className='fields'>
                      {
                        fields !== undefined && fields.map((d) => (
                          <span>{d}</span>
                        ))
                      }
                    </div>
                  </div>
                  <div className='price_btn'>
                      <button onClick={() => executeBatchCall(5, data.walletAddress, 5000000000000)}>$5 / 5 days</button>
                      <button onClick={() => executeBatchCall(10, data.walletAddress, 1000000000000000)}>$10 / 15 days</button>     
                      <button onClick={() => executeBatchCall(25, data.walletAddress, 1500000000000000)}>$25 / 30 days</button>   
                  </div>
                </div>
                <h1 style={{"width":"100%", "fontSize":"20px","padding":"10px","marginTop":"20px","color":"black"}}>Included Videos</h1>
                <div className='v_cont'>
                {
                      vid !== undefined && vid.map((d) => (
                        <div className='vid_cont'>
                          <div className='vid'>
                            <Player 
                                showTitle
                                poster={logo}
                                aspectRatio="16to9"
                                objectFit="cover"
                                showLoadingSpinner={false}
                                theme={{
                                  borderStyles: {
                                    containerBorderStyle: 'hidden',
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
                          <p>{d.title}</p>                   
                        </div>
                      ))
                    }
                </div>
                
                <Chat
                  account={address} //user address
                  supportAddress={data.walletAddress} //Receiver address
                  apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
                  env="staging"
                />
            </div>
            
            )
        }
    </>
  )
}

export default VidList
