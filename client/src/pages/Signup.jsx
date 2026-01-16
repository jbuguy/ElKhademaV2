import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    X,
} from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { useSignup } from "../hooks/useSignup";
import GoogleLoginButton from "../components/GoogleLoginButton";

const uploadMedia = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ secure_url: e.target.result });
        reader.readAsDataURL(file);
    });
};

const commonInputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
};

const labelStyle = {
    display: "block",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "8px",
};

const buttonStyle = (bg = "#0d9488", disabled = false) => ({
    padding: "8px 16px",
    backgroundColor: bg,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background-color 0.3s",
});

// FormField supports string and { value, label } options
const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    options = [],
    maxLength,
    placeholder,
}) => (
    <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>{label}</label>
        {type === "select" ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                style={commonInputStyle}
            >
                <option value="">Select {label}</option>
                {options.map((opt, index) => {
                    const optionValue =
                        typeof opt === "object" ? opt.value : opt;
                    const optionLabel =
                        typeof opt === "object"
                            ? opt.label || opt.value
                            : opt.charAt(0).toUpperCase() + opt.slice(1);

                    return (
                        <option key={optionValue || index} value={optionValue}>
                            {optionLabel}
                        </option>
                    );
                })}
            </select>
        ) : type === "textarea" ? (
            <>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    rows={4}
                    style={{ ...commonInputStyle, resize: "none" }}
                />
                <p
                    style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                    }}
                >
                    {value.length}/{maxLength} characters
                </p>
            </>
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={commonInputStyle}
            />
        )}
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
    const [uploadingCompanyProfilePic, setUploadingCompanyProfilePic] =
        useState(false);

    // Hover states
    const [isNextHovered, setIsNextHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isSignupHovered, setIsSignupHovered] = useState(false);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        birthday: "",
        location: "",
        gender: "",
        profilePic: "",
        profilePicPreview: "",
    });

    const [companyData, setCompanyData] = useState({
        companyName: "",
        foundedDate: "",
        founderName: "",
        companyDescription: "",
        industry: "",
        companySize: "",
        website: "",
        profilePic: "",
        profilePicPreview: "",
    });

    const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
    const sizeOptions = sizes.map((s) => ({
        value: s,
        label: `${s} employees`,
    }));

    const industries = [
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Retail",
        "Manufacturing",
        "Other",
    ];
    const genders = ["male", "female"];
    const navigate = useNavigate();
    const { signup, signupCompany, isLoading, error } = useSignup();
    // Live password validation
    useEffect(() => {
        if (!password && !confirmPassword) {
            setPasswordError("");
            return;
        }

        if (password.length > 0 && password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
        } else if (confirmPassword && password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    }, [password, confirmPassword]);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleMediaUpload = async (e, isCompany) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            isCompany
                ? setUploadingCompanyProfilePic(true)
                : setUploadingProfilePic(true);
            const result = await uploadMedia(file);

            if (result.secure_url) {
                if (isCompany) {
                    setCompanyData({
                        ...companyData,
                        profilePic: result.secure_url,
                        profilePicPreview: result.secure_url,
                    });
                } else {
                    setUserData({
                        ...userData,
                        profilePic: result.secure_url,
                        profilePicPreview: result.secure_url,
                    });
                }
                showNotification(
                    `${
                        isCompany ? "Company logo" : "Profile picture"
                    } uploaded successfully`,
                    "success"
                );
            } else {
                showNotification(
                    `Failed to upload ${
                        isCompany ? "company logo" : "profile picture"
                    }`,
                    "error"
                );
            }
        } catch (error) {
            showNotification("Upload failed", "error");
        } finally {
            isCompany
                ? setUploadingCompanyProfilePic(false)
                : setUploadingProfilePic(false);
        }
    };

    const isFormValid = () => {
        if (!email || !password || !confirmPassword || passwordError)
            return false;
        if (role === "user") {
            return userData.firstName && userData.lastName;
        }
        if (role === "company") {
            return (
                companyData.companyName &&
                companyData.founderName &&
                companyData.foundedDate &&
                companyData.industry &&
                companyData.companySize &&
                companyData.website &&
                companyData.companyDescription
            );
        }
        return false;
    };

    const getMaxPage = () => (role === "user" ? 1 : role === "company" ? 3 : 0);

    const handleInputChange = (e, isCompany) => {
        const { name, value } = e.target;
        isCompany
            ? setCompanyData({ ...companyData, [name]: value })
            : setUserData({ ...userData, [name]: value });
    };

    const Notification = ({ notif }) =>
        notif ? (
            <div
                style={{
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    backgroundColor:
                        notif.type === "error" ? "#fef2f2" : "#f0fdf4",
                    border: `1px solid ${
                        notif.type === "error" ? "#fecaca" : "#86efac"
                    }`,
                }}
            >
                {notif.type === "error" ? (
                    <AlertCircle
                        style={{
                            color: "#ef4444",
                            flexShrink: 0,
                            marginTop: "4px",
                        }}
                        size={24}
                    />
                ) : (
                    <CheckCircle
                        style={{
                            color: "#22c55e",
                            flexShrink: 0,
                            marginTop: "4px",
                        }}
                        size={24}
                    />
                )}
                <p
                    style={{
                        flex: 1,
                        fontSize: "14px",
                        fontWeight: "600",
                        color: notif.type === "error" ? "#991b1b" : "#166534",
                    }}
                >
                    {notif.message}
                </p>
                <button
                    type="button"
                    onClick={() => setNotification(null)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    <X
                        size={20}
                        style={{
                            color:
                                notif.type === "error" ? "#f87171" : "#86efac",
                        }}
                    />
                </button>
            </div>
        ) : null;

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "0 auto",
                padding: "20px 10px",
                backgroundColor: "#ffffff",
            }}
        >
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                {(role === "company" || role === "user") &&
                    getMaxPage() > 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "24px",
                                gap: "8px",
                            }}
                        >
                            {Array.from({ length: getMaxPage() + 1 }).map(
                                (_, page) => (
                                    <div
                                        key={page}
                                        style={{
                                            height: "8px",
                                            width:
                                                currentPage === page
                                                    ? "32px"
                                                    : "8px",
                                            borderRadius: "9999px",
                                            backgroundColor:
                                                currentPage === page
                                                    ? "#0d9488"
                                                    : "#d1d5db",
                                            transition: "all 0.3s ease",
                                        }}
                                    />
                                )
                            )}
                        </div>
                    )}

                <Notification notif={notification} />

                <div
                    style={{
                        marginBottom: "24px",
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "24px",
                    }}
                >
                    <div style={{ overflow: "hidden", minHeight: "400px" }}>
                            <div
                                style={{
                                display: "flex",
                                transform: `translateX(-${currentPage * 100}%)`,
                                transition: "transform 0.3s ease-in-out",
                                }}
                            >
                            {/* Page 0: Credentials + Role */}
                            <div
                                style={{
                                    width: "100%",
                                    flexShrink: 0,
                                    padding: "0 4px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        marginBottom: "16px",
                                        color: "#1f2937",
                                    }}
                                >
                                    Create an Account
                                </h3>
                                <FormField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <FormField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="At least 6 characters"
                                />

                                <FormField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />

                                {passwordError && (
                                    <p
                                        style={{
                                            color: "#ef4444",
                                            fontSize: "14px",
                                            marginTop: "-8px",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        {passwordError}
                                    </p>
                                )}

                                <div style={{ marginBottom: "16px" }}>
                                    <label style={labelStyle}>
                                        Account Type:
                                    </label>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            margin: "10px 0",
                                        }}
                                    >
                                        {["user", "company"].map((type) => (
                                            <label
                                                key={type}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    value={type}
                                                    checked={role === type}
                                                    onChange={(e) => {
                                                        setRole(e.target.value);
                                                        setCurrentPage(0);
                                                    }}
                                                />
                                                {type.charAt(0).toUpperCase() +
                                                    type.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Rest of the pages remain the same */}
                            {role === "user" && (
                                <div
                                    style={{
                                        width: "100%",
                                        flexShrink: 0,
                                        padding: "0 4px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            marginBottom: "16px",
                                            color: "#1f2937",
                                        }}
                                    >
                                        Personal Information
                                    </h3>
                                    <ImageUpload
                                        preview={userData.profilePicPreview}
                                        label="profilePic"
                                        isLoading={uploadingProfilePic}
                                        onChange={(e) =>
                                            handleMediaUpload(e, false)
                                        }
                                        buttonLabel="Choose Picture"
                                    />
                                    <FormField
                                        label="First Name"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={(e) =>
                                            handleInputChange(e, false)
                                        }
                                    />
                                    <FormField
                                        label="Last Name"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={(e) =>
                                            handleInputChange(e, false)
                                        }
                                    />
                                    <FormField
                                        label="Gender"
                                        name="gender"
                                        type="select"
                                        value={userData.gender}
                                        onChange={(e) =>
                                            handleInputChange(e, false)
                                        }
                                        options={genders}
                                    />
                                    <FormField
                                        label="Birthday"
                                        name="birthday"
                                        type="date"
                                        value={userData.birthday}
                                        onChange={(e) =>
                                            handleInputChange(e, false)
                                        }
                                    />
                                    <FormField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        type="tel"
                                        value={userData.phoneNumber}
                                        onChange={(e) =>
                                            handleInputChange(e, false)
                                        }
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    <FormField
                                        label="Location"
                                        name="location"
                                        value={userData.location}
                                        onChange={(e) =>
                                            handleInputChange(e, false)
                                        }
                                        placeholder="City, Country"
                                    />
                                </div>
                            )}

                            {role === "company" && (
                                <>
                                    <div
                                        style={{
                                            width: "100%",
                                            flexShrink: 0,
                                            padding: "0 4px",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                marginBottom: "16px",
                                                color: "#1f2937",
                                            }}
                                        >
                                            Company Details
                                        </h3>
                                        <ImageUpload
                                            preview={
                                                companyData.profilePicPreview
                                            }
                                            label="companyProfilePic"
                                            isLoading={
                                                uploadingCompanyProfilePic
                                            }
                                            onChange={(e) =>
                                                handleMediaUpload(e, true)
                                            }
                                            buttonLabel="Choose Logo"
                                        />
                                        <FormField
                                            label="Company Name"
                                            name="companyName"
                                            value={companyData.companyName}
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                        />
                                        <FormField
                                            label="Founder Name"
                                            name="founderName"
                                            value={companyData.founderName}
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                        />
                                        <FormField
                                            label="Founded Date"
                                            name="foundedDate"
                                            type="date"
                                            value={companyData.foundedDate}
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                        />
                                    </div>

                                    <div
                                        style={{
                                            width: "100%",
                                            flexShrink: 0,
                                            padding: "0 4px",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                marginBottom: "16px",
                                                color: "#1f2937",
                                            }}
                                        >
                                            Business Information
                                        </h3>
                                        <FormField
                                            label="Industry"
                                            name="industry"
                                            type="select"
                                            value={companyData.industry}
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                            options={industries}
                                        />
                                        <FormField
                                            label="Company Size"
                                            name="companySize"
                                            type="select"
                                            value={companyData.companySize}
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                            options={sizeOptions}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            width: "100%",
                                            flexShrink: 0,
                                            padding: "0 4px",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                marginBottom: "16px",
                                                color: "#1f2937",
                                            }}
                                        >
                                            Additional Details
                                        </h3>
                                        <FormField
                                            label="Company Description"
                                            name="companyDescription"
                                            type="textarea"
                                            value={
                                                companyData.companyDescription
                                            }
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                            maxLength={1000}
                                        />
                                        <FormField
                                            label="Website"
                                            name="website"
                                            type="url"
                                            value={companyData.website}
                                            onChange={(e) =>
                                                handleInputChange(e, true)
                                            }
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "24px",
                        }}
                    >
                        {currentPage > 0 && (
                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                style={{
                                    ...buttonStyle("#e5e7eb"),
                                    color: "#374151",
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: isBackHovered
                                        ? "#d1d5db"
                                        : "#e5e7eb",
                                }}
                                onMouseEnter={() => setIsBackHovered(true)}
                                onMouseLeave={() => setIsBackHovered(false)}
                            >
                                <ChevronLeft size={20} />
                                <span style={{ marginLeft: "4px" }}>Back</span>
                            </button>
                        )}

                        {currentPage < getMaxPage() && (
                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                style={{
                                    ...buttonStyle("#0d9488"),
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "auto",
                                    backgroundColor: isNextHovered
                                        ? "#0f766e"
                                        : "#0d9488",
                                }}
                                onMouseEnter={() => setIsNextHovered(true)}
                                onMouseLeave={() => setIsNextHovered(false)}
                            >
                                <span style={{ marginRight: "4px" }}>Next</span>
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (isFormValid()) {
                            if (role === "user") {
                                signup(email, password, "user");
                            } else if (role === "company") {
                                signupCompany(
                                    email,
                                    password,
                                    "company",
                                    companyData
                                );
                            }
                            showNotification(
                                role === "user"
                                    ? "User signup successful!"
                                    : "Company signup successful!",
                                "success"
                            );
                        }
                    }}
                    disabled={!isFormValid()}
                    style={{
                        ...buttonStyle("#10B981", !isFormValid()),
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "600",
                        backgroundColor: isFormValid()
                            ? isSignupHovered
                                ? "#0f766e"
                                : "#10B981"
                            : undefined,
                    }}
                    onMouseEnter={() => setIsSignupHovered(true)}
                    onMouseLeave={() => setIsSignupHovered(false)}
                >
                    Sign Up
                </button>

                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <div
                           style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            marginBottom: "8px",
                        }}
                    >
                        Or sign up with
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <GoogleLoginButton
                            onSuccess={() => {
                                showNotification(
                                    "Signed up with Google",
                                    "success"
                                );
                                navigate("/profile/editprofile", {
                                    replace: true,
                                });
                            }}
                            onError={(err) =>
                                showNotification(
                                    err?.message || "Google signup failed",
                                    "error"
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
    