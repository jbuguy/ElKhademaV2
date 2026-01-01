import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, X, Upload } from 'lucide-react';

const uploadMedia = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ secure_url: e.target.result });
    reader.readAsDataURL(file);
  });
};

const commonInputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '8px'
};

const buttonStyle = (bg = '#0d9488', disabled = false) => ({
  padding: '8px 16px',
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  transition: 'background-color 0.3s'
});

const FormField = ({ label, name, type = "text", value, onChange, options, maxLength, placeholder }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={labelStyle}>{label}</label>
    {type === 'select' ? (
      <select name={name} value={value} onChange={onChange} style={commonInputStyle}>
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{typeof opt === 'string' && opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <>
        <textarea name={name} value={value} onChange={onChange} maxLength={maxLength} rows={4} style={{ ...commonInputStyle, resize: 'none' }} />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{value.length}/{maxLength} characters</p>
      </>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={commonInputStyle} />
    )}
  </div>
);

const ImageUpload = ({ preview, label, isLoading, onChange, buttonLabel }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {preview ? <img src={preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload style={{ color: '#9ca3af' }} size={32} />}
      </div>
      <div style={{ flex: 1 }}>
        <input type="file" id={label} accept="image/*" onChange={onChange} disabled={isLoading} style={{ display: 'none' }} />
        <label htmlFor={label} style={{ ...buttonStyle('#0d9488', isLoading), display: 'inline-block' }} onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#0f766e')} onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#0d9488')}>
          {isLoading ? "Uploading..." : buttonLabel}
        </label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>JPG, PNG (max 5MB)</p>
      </div>
    </div>
  </div>
);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [currentPage, setCurrentPage] = useState(0);
  const [notification, setNotification] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingCompanyProfilePic, setUploadingCompanyProfilePic] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '', lastName: '', phoneNumber: '', birthday: '', location: '', gender: '', profilePic: '', profilePicPreview: ''
  });

  const [companyData, setCompanyData] = useState({
    companyName: '', foundedDate: '', founderName: '', companyDescription: '', industry: '', companySize: '', website: '', profilePic: '', profilePicPreview: ''
  });

  const size = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Other'];
  const genders = ['male', 'female'];

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleMediaUpload = async (e, isCompany) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      isCompany ? setUploadingCompanyProfilePic(true) : setUploadingProfilePic(true);
      const result = await uploadMedia(file);

      if (result.secure_url) {
        isCompany
          ? setCompanyData({ ...companyData, profilePic: result.secure_url, profilePicPreview: result.secure_url })
          : setUserData({ ...userData, profilePic: result.secure_url, profilePicPreview: result.secure_url });
        showNotification(`${isCompany ? 'Company logo' : 'Profile picture'} uploaded successfully`, "success");
      } else {
        showNotification(`Failed to upload ${isCompany ? 'company logo' : 'profile picture'}`, "error");
      }
    } catch (error) {
      showNotification(error.message || "Upload failed", "error");
    } finally {
      isCompany ? setUploadingCompanyProfilePic(false) : setUploadingProfilePic(false);
    }
  };

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setPasswordError("Passwords are required");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword || !validatePasswords()) return false;
    if (role === "user") return userData.firstName && userData.lastName;
    if (role === "company") return companyData.foundedDate && companyData.founderName && companyData.companyDescription && companyData.industry && companyData.companySize && companyData.website && companyData.companyName;
    return false;
  };

  const getMaxPage = () => (role === "user" ? 1 : role === "company" ? 3 : 0);
  const handleInputChange = (e, isCompany) => {
    isCompany
      ? setCompanyData({ ...companyData, [e.target.name]: e.target.value })
      : setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const Notification = ({ notif }) => notif ? (
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderRadius: '8px', backgroundColor: notif.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${notif.type === 'error' ? '#fecaca' : '#86efac'}` }}>
      {notif.type === 'error' ? <AlertCircle style={{ color: '#ef4444', flexShrink: 0, marginTop: '4px' }} size={24} /> : <CheckCircle style={{ color: '#22c55e', flexShrink: 0, marginTop: '4px' }} size={24} />}
      <p style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: notif.type === 'error' ? '#991b1b' : '#166534' }}>{notif.message}</p>
      <button type="button" onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: notif.type === 'error' ? '#f87171' : '#86efac', padding: 0 }}><X size={20} /></button>
    </div>
  ) : null;

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px 10px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
        {(role === "company" || role === "user") && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', gap: '8px' }}>
            {Array.from({ length: getMaxPage() + 1 }).map((_, page) => (
              <div key={page} style={{ height: '8px', width: currentPage === page ? '32px' : '8px', borderRadius: '9999px', backgroundColor: currentPage === page ? '#0d9488' : '#d1d5db', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        )}

        <Notification notif={notification} />

        <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', transform: `translateX(-${currentPage * 100}%)`, transition: 'transform 0.3s ease-in-out' }}>

              {/* Page 0: Email, Password, Account Type */}
              <div style={{ width: '100%', flexShrink: 0, padding: '0 4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Create an Account</h3>
                <FormField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormField label="Password" name="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }} />
                <FormField label="Confirm Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }} />
                {passwordError && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{passwordError}</p>}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Account Type:</label>
                  <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
                    {['user', 'company'].map(type => (
                      <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input type="radio" value={type} checked={role === type} onChange={(e) => { setRole(e.target.value); setCurrentPage(0); }} />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Pages */}
              {role === "user" && (
                <div style={{ width: '100%', flexShrink: 0, padding: '0 4px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Personal Information</h3>
                  <ImageUpload preview={userData.profilePicPreview} label="profilePic" isLoading={uploadingProfilePic} onChange={(e) => handleMediaUpload(e, false)} buttonLabel="Choose Picture" />
                  <FormField label="First Name" name="firstName" value={userData.firstName} onChange={(e) => handleInputChange(e, false)} />
                  <FormField label="Last Name" name="lastName" value={userData.lastName} onChange={(e) => handleInputChange(e, false)} />
                  <FormField label="Gender" name="gender" type="select" value={userData.gender} onChange={(e) => handleInputChange(e, false)} options={genders} />
                  <FormField label="Birthday" name="birthday" type="date" value={userData.birthday} onChange={(e) => handleInputChange(e, false)} />
                  <FormField label="Phone Number" name="phoneNumber" type="tel" value={userData.phoneNumber} onChange={(e) => handleInputChange(e, false)} placeholder="+1 (555) 123-4567" />
                  <FormField label="Location" name="location" value={userData.location} onChange={(e) => handleInputChange(e, false)} placeholder="City, Country" />
                </div>
              )}

              {/* Company Pages */}
              {role === "company" && (
                <>
                  <div style={{ width: '100%', flexShrink: 0, padding: '0 4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Company Details</h3>
                    <ImageUpload preview={companyData.profilePicPreview} label="companyProfilePic" isLoading={uploadingCompanyProfilePic} onChange={(e) => handleMediaUpload(e, true)} buttonLabel="Choose Logo" />
                    <FormField label="Company Name" name="companyName" value={companyData.companyName} onChange={(e) => handleInputChange(e, true)} />
                    <FormField label="Founder Name" name="founderName" value={companyData.founderName} onChange={(e) => handleInputChange(e, true)} />
                    <FormField label="Founded Date" name="foundedDate" type="date" value={companyData.foundedDate} onChange={(e) => handleInputChange(e, true)} />
                  </div>

                  <div style={{ width: '100%', flexShrink: 0, padding: '0 4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Business Information</h3>
                    <FormField label="Industry" name="industry" type="select" value={companyData.industry} onChange={(e) => handleInputChange(e, true)} options={industries} />
                    <FormField label="Company Size" name="companySize" type="select" value={companyData.companySize} onChange={(e) => handleInputChange(e, true)} options={size.map(s => ({ value: s, label: `${s} employees` }))} />
                  </div>

                  <div style={{ width: '100%', flexShrink: 0, padding: '0 4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Additional Details</h3>
                    <FormField label="Company Description" name="companyDescription" type="textarea" value={companyData.companyDescription} onChange={(e) => handleInputChange(e, true)} maxLength={1000} />
                    <FormField label="Website" name="website" type="url" value={companyData.website} onChange={(e) => handleInputChange(e, true)} placeholder="https://example.com" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            {currentPage > 0 && (
              <button type="button" onClick={() => setCurrentPage(currentPage - 1)} style={{ ...buttonStyle('#e5e7eb'), color: '#374151', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#d1d5db')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#e5e7eb')}>
                <ChevronLeft size={20} /><span style={{ marginLeft: '4px' }}>Back</span>
              </button>
            )}
            {currentPage < getMaxPage() && (
              <button type="button" onClick={() => setCurrentPage(currentPage + 1)} style={{ ...buttonStyle('#0d9488'), display: 'flex', alignItems: 'center', marginLeft: 'auto' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#0f766e')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#0d9488')}>
                <span style={{ marginRight: '4px' }}>Next</span><ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        <button onClick={() => isFormValid() && showNotification(role === 'user' ? 'User signup successful' : 'Company signup successful', 'success')} disabled={!isFormValid()} style={{ ...buttonStyle('#1aac83', !isFormValid()), width: '100%', fontSize: '16px', fontWeight: '600' }} onMouseEnter={(e) => isFormValid() && (e.target.style.backgroundColor = '#0f766e')} onMouseLeave={(e) => isFormValid() && (e.target.style.backgroundColor = '#1aac83')}>
          Sign Up
        </button>
      </div >
    </div >
  );
}
