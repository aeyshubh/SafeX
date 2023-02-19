import React, { useContext, useEffect, useState } from "react";
import Header from '../../components/Header/Header'
import Bg from "../../components/Bg_home/Bg";
import  './style.css'
import { Link, useNavigate } from "react-router-dom";
import Auth from "../../context/Auth";
import axios from "axios";

const Home = () => {

  const { address } = useContext(Auth)
  const [creatorExist, setCreator] = useState()
  const [learnerExist, setLearner] = useState()

  const checkCreator = async () => {
		if(address !== undefined){
			const data = await axios.get(`https://apisuperlearn.up.railway.app/api/get_teacher?wAddress=${address}`)
			if(data !== 'None') {
				setCreator(true)
			} 
		} else {
			setCreator(false)
		}
	}

	const checkLearner = async () => {
		if(address !== undefined){
			const data = await axios.get(`https://apisuperlearn.up.railway.app/api/get_student?wAddress=${address}`)
			if(data !== 'None') {
				setLearner(true)
			} 
		} else {
			setLearner(false)
		}  
	}

  useEffect(() => {
    checkCreator()
    checkLearner()
  }, [])

  return (
    <>
      <Header />
      <div className="begin">
        <div className="b_first">
          <p>Grow your skills to advance your career path</p>
          <div>
            <Link to="/dashboard"><button>Creator</button></Link>
            <Link to="/explore"><button>Explorer</button></Link>
          </div> 
        </div>     
        <div className="b_sec">
          
        </div>  
      </div>
      <Bg />
    </>
  );
};

export default Home;
