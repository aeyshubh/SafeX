import {useContext, useState} from 'react';
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import Auth from '../context/Auth';
import './style.scss'

function CreateTransaction() {
  const {address} = useContext(Auth)
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [recipient,setRecipient] = useState('');
  const [flow,setFlow] = useState('');

  async function createNewFlow(){

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        sender: address,
        receiver: recipient,
        flowRate: flow,
        superToken: DAIx
      });

      console.log("Creating your stream...");

      await createFlowOperation.exec(signer);

      console.log(
        `Congrats - you've just created a money stream!
          View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
          Network: Kovan
          Super Token: DAIx
          Sender: ${address}
          Receiver: ${recipient},
          FlowRate: ${flow}
          `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  async function deleteNetFlow() {
    //Rainbow kit accounts

    console.log("In stream delete");
    console.log("Current Account is : " + address + "Recipient is :" + recipient);

    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;

    try {
      let flowOp = sf.cfaV1.deleteFlow({
        superToken: DAIx,
        sender: address,
        receiver: recipient,
        //userData: 'I am Enting the Stream'
      });
      await flowOp.exec(signer);
    } catch (e) {
      console.log(e);
    }
    console.log("Stream Ended ");
  }

  return (
    <div className='bg'>
      <h1>Create Transaction</h1><br /><br />
      <form class="form">
        <div class="form__field">
          <div class="input-group">
            <label class="input-group__label">Receiver wallet address</label>
            <input type="text" class="input-group__input" onChange={e=>setRecipient(e.target.value)}></input> 
          </div>
          <div class="input-group">
            <label class="input-group__label">Flowrate</label>
            <input type="text" class="input-group__input" onChange={e=>setFlow(e.target.value)}></input>
          </div>
          <button onClick={createNewFlow} className='butto' type='button'>Start stream</button>
          <button onClick={deleteNetFlow} className='butto' type='button'>Delete stream</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTransaction;
