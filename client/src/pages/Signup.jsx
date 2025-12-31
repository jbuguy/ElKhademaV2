
import { useState } from "react"
import { useSignup } from "../hooks/useSignup";
import { ChevronLeft, ChevronRight , AlertCircle, CheckCircle, X } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [companyData,setCompanyData] =useState({
    companyName: '',
    foundedDate: '',
    founderName: '',
    companyDescription: '',
    industry: '',
    companySize: '',
    website: ''
  });
  const size = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Other'];

  const [currentPage, setCurrentPage] = useState(0);

  const [notification, setNotification] = useState(null);
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };


  const nextPage = () => {
    
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleInputChange = (e) => {
      setCompanyData({
        ...companyData,
        [e.target.name]: e.target.value
      });
    };

  const handleAccountTypeChange = (type) => {
    setRole(type);
    setCurrentPage(0);
  };
  const isFormValid = () => {
    if (!email || !password) return false;

    if (role === "user") {
      return true
    }

    if (role === "company") {
      return (
        companyData.foundedDate &&
        companyData.founderName &&
        companyData.companyDescription &&
        companyData.industry &&
        companyData.companySize &&
        companyData.website&&
        companyData.companyName
      );
    }
    return false;
  };
  const { signup, signupCompany , isLoading, error } = useSignup();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role==="user"){
    try {
      await signup(email, password, role);
    } catch (error) {
      showNotification(error,"error")
    }}else if(role==="company"){
      try {
      await signupCompany(email, password, role,companyData);
    } catch (error) {
      showNotification(error.message ,"error");
    }
    }

  };
  return (
    <form className="login" onSubmit={(e)=>{handleSubmit(e)}}>
      {/* Progress Indicator */}
      {role==="company"&&
                <div className="flex justify-center mb-6">
                  {[0, 1, 2 ,3].map((page) => (
                    <div
                      key={page}
                      className={`h-2 w-2 rounded-full mx-1 transition-all ${
                        currentPage === page ? 'bg-teal-600 w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>}
      {/* Notifications */}
      {notification && (
          <div className={`mb-4 flex items-start gap-3 px-4 py-3 rounded-lg animate-slide-down ${
            notification.type === 'error' 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
            ) : (
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={24} />
            )}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${
                notification.type === 'error' ? 'text-red-800' : 'text-green-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className={`flex-shrink-0 ${
                notification.type === 'error' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        )}
      {/* ==========================================
      adding a carousel to insert more information to the componay
       ===============================================*/}
            <div className="mb-6">
              <div className="border-t border-gray-200 pt-6">
                

                {/* Carousel Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentPage * 100}%)` }}
                  >
                    {/* Page number 0 default for user */}
                    <div className="w-full flex-shrink-0 px-1">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">create an account</h3>
                      <label >Email:</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                      <label >password:</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                      
                      <label>Account Type:</label>
                      <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            value="user" 
                            checked={role === "user"} 
                            onChange={e => handleAccountTypeChange(e.target.value)}
                          />
                          User
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            value="company" 
                            checked={role === "company"} 
                            onChange={e => handleAccountTypeChange(e.target.value)}
                          />
                          Company
                        </label>
                      </div>
                    </div>
                    {/* Page 1: Basic Company Info */}
                    <div className="w-full flex-shrink-0 px-1">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Company Details</h3>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Company Name:
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={companyData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Founder Name:
                        </label>
                        <input
                          type="text"
                          name="founderName"
                          value={companyData.founderName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Founded Date:
                        </label>
                        <input
                          type="date"
                          name="foundedDate"
                          value={companyData.foundedDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    {/* Page 2: Industry & Size */}
                    <div className="w-full flex-shrink-0 px-1">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Business Information</h3>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Industry:
                        </label>
                        <select
                          name="industry"
                          value={companyData.industry}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Select Industry</option>
                          {industries.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Company Size:
                        </label>
                        <select
                          name="companySize"
                          value={companyData.companySize}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Select Size</option>
                          {size.map((size) => (
                            <option key={size} value={size}>{size} employees</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Page 3: Description & Website */}
                    <div className="w-full flex-shrink-0 px-1">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Details</h3>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Company Description:
                        </label>
                        <textarea
                          name="companyDescription"
                          value={companyData.companyDescription}
                          onChange={handleInputChange}
                          maxLength={1000}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {companyData.companyDescription.length}/1000 characters
                        </p>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Website:
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={companyData.website}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                {role==="company" && currentPage >0 ?(
                  <button
                    type="button"
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors `}
                    style={{backgroundColor:
                      currentPage === 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }}
                  >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Back</span>
                  </button>
                ):<span></span>}
                  {role==="company"&&currentPage < 3 ? (
                    <button
                      type="button"
                      onClick={nextPage}
                      className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      <span className="mr-1">Next</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>




        {/* ========== Submit Button ===========*/}
      
      <button type="submit" className="container"
 disabled={isLoading || !isFormValid()}
 style={{ opacity: (isLoading || !isFormValid()) ? 0.6 : 1, cursor: (isLoading || !isFormValid()) ? 'not-allowed' : 'pointer' }}>
  <div 
      className="row px-4 py-1  text-white rounded-md hover:bg-teal-700 transition-colors" style={{backgroundColor:'#1aac83'}}
      >
        <span className=" col-1 self-center">Sign Up</span>
        </div></button>
      {error && (
        <div className="error">
          {error?.response.data?.error}
        </div>
      )}
    </form>
  )
}
