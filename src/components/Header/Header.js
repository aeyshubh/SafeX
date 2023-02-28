import React, { useEffect } from "react";
import "./headerStyle.scss";
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";
import AOS from "aos";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {

  const open = () => {
    document.getElementById('menu').classList.toggle('open')
  }

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="header">
      <div className="img-search">
        <Link to="/"><img
          src={logo}
          alt=""
          data-aos="fade-right"
          data-aos-anchor="#example-anchor"
          data-aos-offset="500"
          data-aos-duration="200"
        /></Link>
      </div>

      <div class="menu" id="menu" onClick={open}>
        <div class="button" title="create transaction"><Link to="/create-transaction"><i class='bx bxs-layer-plus icons' ></i></Link></div>
        <div class="button" title="buy caseflow nfts"><Link to="/buy-cashflow-nfts"><i class='bx bx-add-to-queue icons' ></i></Link></div>
        <div class="button" title="your nfts"><Link to="/profile"><i class='bx bx-user-pin icons'></i></Link></div>
        <div class="button" title="sell caseflow nfts"><Link to="/sell-cashflow-nfts"><i class='bx bx-outline icons' ></i></Link></div>
        <div class="button"><ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} /></div>
      </div>
    </div>
  );
};

export default Header;