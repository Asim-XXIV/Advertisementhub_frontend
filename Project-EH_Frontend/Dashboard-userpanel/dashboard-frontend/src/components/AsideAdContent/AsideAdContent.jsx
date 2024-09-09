import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AsideAdContent.css';

const AsideAdContent = () => {
    const [ads, setAds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAds();
        checkPopupStatus();

        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAds = async () => {
        try {
            const token = localStorage.getItem('access_token');
            console.log('Fetching ads with token:', token);
            const response = await axios.get('http://127.0.0.1:8000/api/admin_ads/list/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API Response:', response);
            const data = Array.isArray(response.data) ? response.data : [];
            setAds(data);
        } catch (error) {
            console.error('Error fetching ads:', error.response || error);
            setAds([]);
        }
    };

    const checkPopupStatus = () => {
        const popupClosed = localStorage.getItem('popupClosed');
        if (!popupClosed && window.innerWidth <= 768) {
            setShowPopup(true);
        }
    };

    const handleAdClick = (ad) => {
        if (isMobile) {
            setSelectedAd(ad);
        } else {
            navigate(`/dashboard/admin_ads/${ad.id}`);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedAd(null);
        localStorage.setItem('popupClosed', 'true');
    };

    return (
        <>
            {/* Main Container for Desktop View */}
            {!isMobile && (
                <div className="AsideAdContent-container">
                    {ads && ads.map((ad) => (
                        <div key={ad.id} className="ad-square" onClick={() => handleAdClick(ad)}>
                            <img src={ad.thumbnail} alt={ad.title} />
                        </div>
                    ))}
                </div>
            )}

            {/* Popup for Mobile View */}
            {isMobile && showPopup && (
                <div className="AsideAdContent-popup">
                    <button className="AsideAdContent-close" onClick={handleClosePopup}>
                        <span className="close-icon">✕</span>
                    </button>
                    <div className="AsideAdContent-popupContent">
                        {selectedAd ? (
                            <div className="AsideAdContent-adDetails">
                                <button className="AsideAdContent-back" onClick={() => setSelectedAd(null)}>
                                    Back to Ads
                                </button>
                                <h2>{selectedAd.title}</h2>
                                <img src={selectedAd.thumbnail} alt={selectedAd.title} />
                                <p>{selectedAd.details}</p>
                                {selectedAd.discounts && <p>Discounts: {selectedAd.discounts}</p>}
                                {selectedAd.offers && <p>Offers: {selectedAd.offers}</p>}
                                {selectedAd.referral_code && <p>Referral Code: {selectedAd.referral_code}</p>}
                                <p>Guidelines: {selectedAd.guidelines}</p>
                                {selectedAd.links && <p>Links: {selectedAd.links}</p>}
                            </div>
                        ) : (
                            ads && ads.map((ad) => (
                                <div key={ad.id} className="ad-square" onClick={() => handleAdClick(ad)}>
                                    <img src={ad.thumbnail} alt={ad.title} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AsideAdContent;