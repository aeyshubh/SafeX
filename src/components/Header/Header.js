import React, { useEffect } from "react";
import "./headerStyle.css";
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";
import AOS from "aos";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="header">
      <div className="img-search">
        <img
          src={logo}
          alt=""
          data-aos="fade-right"
          data-aos-anchor="#example-anchor"
          data-aos-offset="500"
          data-aos-duration="200"
        />
      </div>

      <div className="nav">
        <ul>
          <li>
            <Link to="/">
              <p className="btn from-top">home</p>
            </Link>
          </li>
          <li>
            <Link>
              <p className="btn from-top">courses</p>
            </Link>
          </li>
          <li>
            <Link>
              <p className="btn from-top">features</p>
            </Link>
          </li>
          <li>
            <Link>
              <p className="btn from-top">channels</p>
            </Link>
          </li>

          {/* { 
            !walletAddress 
              ? <li><button onClick={connectWallet}><p style={{padding:"7px 5px"}}>Connect wallet</p></button></li>
              : <li><Link to="/account"><p className="metamask" title={walletAddress}><i class="fa-solid fa-user"></i></p></Link></li>
          }   */}
          
        </ul>
      </div>

      <div>
        <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
      </div>

    </div>
  );
};

export default Header;
