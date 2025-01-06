import React from 'react';
import './RITBanner.css';
import ritLogo from '../../assets/branding/RIT_hor_w.svg'

const RITBanner = () => {
    return (
        <div className='ritBanner'>
            <div className='ritBanner__inner'>
                <img src={ritLogo} alt="" />
            </div>
        </div>
    );
}

export default RITBanner;
