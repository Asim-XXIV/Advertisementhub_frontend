import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faInfoCircle, faPercentage, faGift,
    faTicketAlt, faBookOpen, faExternalLinkAlt, faClock, faTimes
} from '@fortawesome/free-solid-svg-icons';
import './AdDetails.css';

const AdDetails = ({ mobileAdId }) => {
    const { id: desktopAdId } = useParams(); // Get the ID from URL params on desktop
    const [ad, setAd] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showFullScreenPopup, setShowFullScreenPopup] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isPopup = location.state?.showPopup || false;

    const adId = isMobile ? mobileAdId : desktopAdId;  // Use mobile ID if mobile, otherwise desktop ID

    useEffect(() => {
        if (adId) {
            fetchAdDetails(adId);
        } else {
            console.error('No valid ad ID provided.');
        }

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [adId]);

    const fetchAdDetails = async (adId) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`http://localhost:8000/api/admin_ads/${adId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAd(response.data);
        } catch (error) {
            console.error('Error fetching ad details:', error);
            setAd(null);
        }
    };

    const handleBack = () => {
        if (isPopup) {
            navigate('/dashboard/aside-ad-content', { state: { showPopup: true } });
        } else {
            navigate(-1);
        }
    };

    const handleThumbnailClick = () => {
        if (isMobile) {
            setShowFullScreenPopup(true);
        }
    };

    const renderAdContent = () => (
        <>
            <header className="ad-header">
                <button onClick={handleBack} className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <h1>{ad?.title}</h1>
            </header>
            <main className="ad-content">
                <img src={ad?.thumbnail} alt={ad?.title} className="ad-thumbnail" onClick={handleThumbnailClick} />
                <section className="ad-section">
                    <h2><FontAwesomeIcon icon={faInfoCircle} /> Details</h2>
                    <CKEditor
                        editor={ClassicEditor}
                        data={ad?.details}
                        disabled={true}
                        config={{ toolbar: [] }}
                    />
                </section>
                {ad?.discounts && (
                    <section className="ad-section">
                        <h2><FontAwesomeIcon icon={faPercentage} /> Discounts</h2>
                        <p>{ad.discounts}</p>
                    </section>
                )}
                {ad?.offers && (
                    <section className="ad-section">
                        <h2><FontAwesomeIcon icon={faGift} /> Offers</h2>
                        <p>{ad.offers}</p>
                    </section>
                )}
                {ad?.referral_code && (
                    <section className="ad-section">
                        <h2><FontAwesomeIcon icon={faTicketAlt} /> Referral Code</h2>
                        <p className="referral-code">{ad.referral_code}</p>
                    </section>
                )}
                {ad?.guidelines && (
                    <section className="ad-section">
                        <h2><FontAwesomeIcon icon={faBookOpen} /> Guidelines</h2>
                        <CKEditor
                            editor={ClassicEditor}
                            data={ad.guidelines}
                            disabled={true}
                            config={{ toolbar: [] }}
                        />
                    </section>
                )}
                {ad?.links && (
                    <section className="ad-section">
                        <h2><FontAwesomeIcon icon={faExternalLinkAlt} /> Learn More</h2>
                        <a href={ad.links} target="_blank" rel="noopener noreferrer" className="more-info-link">
                            Visit Link <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </section>
                )}
            </main>
            <footer className="ad-footer">
                <p>This is a sponsored advertisement. Terms and conditions may apply.</p>
            </footer>
        </>
    );

    if (!ad) {
        return <div className="loading"><FontAwesomeIcon icon={faClock} spin /> Loading...</div>;
    }

    return (
        <div className={`ad-details-container ${isMobile && isPopup ? 'popup-mode' : ''}`}>
            {renderAdContent()}
            {showFullScreenPopup && (
                <div className="full-screen-popup">
                    <button className="close-popup" onClick={() => setShowFullScreenPopup(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="popup-content">
                        {renderAdContent()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdDetails;
