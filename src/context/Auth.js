import axios from "axios";
import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { toast } from 'react-toastify';

const Auth = createContext({})

export const AuthProvider = ({ children }) => {

	const { address } = useAccount();  
	const [mainCid, setMainCid] = useState()
    const navigate = useNavigate()

	function checkAddress() {
		if(address === undefined) {
			toast.info(`Connect wallet`, {
			  position: toast.POSITION.TOP_RIGHT
			});
			navigate('/')
		}		

	}
	return (
		<Auth.Provider
			value={{
				address,
				checkAddress,
				mainCid, setMainCid
			}}
		>
			{children}
		</Auth.Provider>
	);
};

export default Auth;
