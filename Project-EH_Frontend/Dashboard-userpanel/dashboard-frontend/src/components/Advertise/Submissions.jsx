import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Submissions.css";

const Submissions = () => {
  const { id } = useParams(); // This is the advertisement ID
  const [proofs, setProofs] = useState([]);
  const [advertisement, setAdvertisement] = useState(null);
  const [error, setError] = useState(null);
  const [enlargedMedia, setEnlargedMedia] = useState(null);

  useEffect(() => {
    fetchAdvertisement();
    fetchProofs();
  }, []);

  const fetchAdvertisement = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8000/api/advertisements/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdvertisement(response.data);
    } catch (error) {
      setError(
        "Error fetching advertisement: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const fetchProofs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8000/api/uproofs/${id}/unapproved/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProofs(response.data);
    } catch (error) {
      setError(
        "Error fetching proofs: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const handleVerifyProof = async (proofId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:8000/api/proofs/${id}/approve/`, // Using the advertisement ID in the URL
        { action: "approve", proof_id: proofId }, // Send proof ID and action in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchProofs(); // Refresh the proofs list after verification
      setError(null);
    } catch (error) {
      setError(
        "Error verifying proof: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const handleDenyProof = async (proofId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:8000/api/proofs/${id}/approve/`, // Using the advertisement ID in the URL
        { action: "deny", proof_id: proofId }, // Send proof ID and action in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchProofs(); // Refresh the proofs list after denial
      setError(null);
    } catch (error) {
      setError(
        "Error denying proof: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };
  const getMediaUrl = (mediaPath) => {
    if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
      const baseUrl = "http://localhost:8000/media/";
      return mediaPath.replace(baseUrl, "");
    }
    return mediaPath;
  };

  const openEnlargedMedia = (media) => {
    setEnlargedMedia(media);
  };

  const closeEnlargedMedia = () => {
    setEnlargedMedia(null);
  };

  if (!advertisement) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className="submissions-container">
    <h2 className="hh">Submissions for {advertisement.title}</h2>
    {error && <div className="error-message">{error}</div>}
    {proofs.length === 0 ? (
      <p>No proofs found for this advertisement.</p>
    ) : (
      <ul>
        {proofs.map((proof) => (
          <li key={proof.id} className="submission-item">
            <p><strong>User:</strong> {proof.user_name}</p>
            <p><strong>Status:</strong> {proof.status}</p>
            <p><strong>Transaction Type:</strong> {proof.transaction_type}</p>
            <p><strong>Date:</strong> {new Date(proof.date).toLocaleString()}</p>
            
            <div className="proof-section">
              <strong>Proof:</strong>
              <div className="proof-container">
                {proof.photo && (
                  <div className="proof-item" onClick={() => openEnlargedMedia({ type: 'image', src: `http://localhost:8000/media/${getMediaUrl(proof.photo)}` })}>
                    <img
                      src={`http://localhost:8000/media/${getMediaUrl(proof.photo)}`}
                      alt="Proof Photo"
                      className="proof-media proof-image"
                    />
                  </div>
                )}
                {proof.video && (
                  <div className="proof-item" onClick={() => openEnlargedMedia({ type: 'video', src: `http://localhost:8000/media/${getMediaUrl(proof.video)}` })}>
                    <video
                      src={`http://localhost:8000/media/${getMediaUrl(proof.video)}`}
                      className="proof-media proof-video"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              {!proof.photo && !proof.video && <p className="no-proof">No proof provided</p>}
            </div>
            <button onClick={() => handleVerifyProof(proof.id)} className="verify-button">
              Verify Proof
            </button>
            <button onClick={() => handleDenyProof(proof.id)} className="deny-button">
              Deny Proof
            </button>
          </li>
        ))}
      </ul>
    )}
    {enlargedMedia && (
      <div className="enlarged-media-overlay" onClick={closeEnlargedMedia}>
        <div className="enlarged-media-content">
          {enlargedMedia.type === 'image' ? (
            <img src={enlargedMedia.src} alt="Enlarged Proof" />
          ) : (
            <video src={enlargedMedia.src} controls autoPlay>
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    )}
  </div>
);
};
export default Submissions;
