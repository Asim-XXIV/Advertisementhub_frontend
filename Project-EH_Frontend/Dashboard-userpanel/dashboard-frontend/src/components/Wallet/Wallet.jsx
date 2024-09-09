import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaWallet, FaMoneyBillWave, FaExchangeAlt, FaFilter } from 'react-icons/fa';



const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [activeDropdown, setActiveDropdown] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filter, setFilter] = useState("7days");
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const transactionsPerPage = 10;

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions(1, filter, true);
  }, [filter]);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://127.0.0.1:8000/api/wallet/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWallet(response.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  const fetchTransactions = async (page, currentFilter, reset = false) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transactions/?page=${page}&page_size=${transactionsPerPage}&filter=${currentFilter}&ordering=-date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setHasMore(data.length === transactionsPerPage);

      if (reset) {
        setTransactions(data);
      } else {
        setTransactions((prevTransactions) => [...prevTransactions, ...data]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleLoadFundsClick = () => {
    setIsPopUpVisible(true);
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/add-balance/",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchWallet();
        setIsPopUpVisible(false);
        setAmount("");
        setCurrentPage(1);
        fetchTransactions(1, filter, true);
      }
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const handleWithdraw = async () => {
    // Implement withdraw functionality here
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? "" : menu);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleFilterSelection = (selectedFilter) => {
    setFilter(selectedFilter);
    setShowFilterOptions(false);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const loadMoreTransactions = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchTransactions(currentPage + 1, filter);
  };
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen">
      <div className="relative mb-6">
      <div className="h-40 md:h-48 bg-[#6c32a0] rounded-t-xl flex flex-col items-center justify-center">
  {wallet && (
    <h2 className="text-white text-xl md:text-2xl font-semibold mb-8 md:mb-12">
      {wallet.full_name}
    </h2>
  )}
</div>
  <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
    <button className="profile-wallet" aria-label="User Profile">
      <img 
        src={wallet?.profile_photo} 
        alt="Profile" 
        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
      />
    </button>
  </div>
      </div>
      
      <div className="mt-16 md:mt-20">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col justify-between h-full space-y-6">
              <div className="space-y-6">
                <div onClick={toggleBalanceVisibility} className="cursor-pointer">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">Wallet Balance:</h2>
                  <div className="flex items-center">
                    <span className="text-2xl md:text-3xl font-bold mr-2">
                      Rs. {wallet ? (isBalanceVisible ? wallet.balance : "XXXX.XX") : "Loading..."}
                    </span>
                    {isBalanceVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-2">Total Earnings:</h2>
                  <p className="text-2xl md:text-3xl font-bold">Rs. {wallet ? wallet.total_earning : "Loading..."}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleLoadFundsClick}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition duration-300 flex items-center justify-center"
                >
                  <FaWallet className="mr-2" size={16} /> Load
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition duration-300 flex items-center justify-center"
                >
                  <FaMoneyBillWave className="mr-2" size={16} /> Withdraw
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div
              className="cursor-pointer h-full flex flex-col justify-between"
              onClick={() => toggleDropdown("earnings")}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-lg md:text-xl">Earnings Details</span>
                  <FaExchangeAlt className={`transform transition-transform duration-300 ${activeDropdown === "earnings" ? "rotate-180" : ""}`} size={20} />
                </div>
                <div className={`mt-4 bg-gray-100 p-4 rounded-lg ${activeDropdown === "earnings" ? "" : "hidden"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-100 p-3 md:p-4 rounded-lg">
                      <h3 className="text-base md:text-lg font-semibold mb-2 text-blue-800">Total Earned</h3>
                      <p className="text-xl md:text-2xl font-bold text-blue-900">Rs. {wallet ? wallet.total_earning : "Loading..."}</p>
                    </div>
                    <div className="bg-green-100 p-3 md:p-4 rounded-lg">
                      <h3 className="text-base md:text-lg font-semibold mb-2 text-green-800">Total Spending</h3>
                      <p className="text-xl md:text-2xl font-bold text-green-900">Rs. {wallet ? wallet.total_spending : "Loading..."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Recent transactions</h3>
            <div className="relative">
              <button
                className="bg-purple-600 text-white px-3 py-2 rounded-lg flex items-center hover:bg-purple-700 transition duration-300"
                onClick={toggleFilterOptions}
              >
                <FaFilter className="mr-2" size={14} /> Filter
              </button>
              {showFilterOptions && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-10 w-40">
                  <div className="py-1">
                    {["7days", "15days", "3months"].map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 text-sm hover:bg-purple-100 cursor-pointer transition duration-300"
                        onClick={() => handleFilterSelection(option)}
                      >
                        Last {option === "7days" ? "7 days" : option === "15days" ? "15 days" : "3 months"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-24rem)] md:max-h-[calc(100vh-28rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition duration-300">
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{transaction.advertisement_title || "N/A"}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">{transaction.transaction_type}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs md:text-sm">Rs. {transaction.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-2 text-center text-gray-500 text-xs md:text-sm">No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                onClick={loadMoreTransactions}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {isPopUpVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-2xl w-full max-w-xs">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Add Funds</h2>
            <form onSubmit={handleAddFunds}>
              <label className="block mb-3">
                <span className="text-gray-700 text-sm">Amount:</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-sm"
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPopUpVisible(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 text-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;