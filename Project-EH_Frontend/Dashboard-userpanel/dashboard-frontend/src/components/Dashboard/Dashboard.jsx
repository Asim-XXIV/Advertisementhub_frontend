import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [dashboardObjects, setDashboardObjects] = useState([]);
  const [expandedObject, setExpandedObject] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard-list/');
        setDashboardObjects(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (obj) => {
    setExpandedObject(obj);
  };

  const closeExpandedView = () => {
    setExpandedObject(null);
  };

  const renderMediaContent = (obj) => {
    if (obj.video) {
      return (
        <video controls className="w-full h-auto">
          <source src={obj.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (obj.photo) {
      return <img src={obj.photo} alt={obj.title} className="w-full h-auto object-cover" />;
    }
    return null;
  };

  const priorityOneObject = dashboardObjects.find(obj => obj.priority === 1);
  const otherObjects = dashboardObjects.filter(obj => obj.priority !== 1);

  return (
    <motion.div 
      className="dashboard w-full p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {priorityOneObject && (
        <motion.div 
          className="full-box bg-gray-100 p-4 rounded-lg mb-6 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-2">{priorityOneObject.title}</h2>
          {renderMediaContent(priorityOneObject)}
        </motion.div>
      )}

      <motion.div 
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatePresence>
          {otherObjects.map((obj, index) => (
            <motion.div 
              key={index} 
              className="box bg-white p-4 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleCardClick(obj)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <h2 className="text-lg font-semibold mb-2">{obj.title}</h2>
              {renderMediaContent(obj)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {expandedObject && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg max-w-3xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">{expandedObject.title}</h2>
              {renderMediaContent(expandedObject)}
              <motion.button 
                onClick={closeExpandedView}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;