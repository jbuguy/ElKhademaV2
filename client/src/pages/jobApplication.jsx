import React, { useState } from "react";
import { X, Upload, CheckCircle, FileText } from "lucide-react";
import { useJobCreation } from "../hooks/useJobCreation.js";

export const ApplicationModal = ({ isOpen, onClose, job }) => {
    const [formData, setFormData] = useState({
        resumeFile: null,
        coverLetterFile: null,
    });

    const { applyjob } = useJobCreation();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.resumeFile) {
                newErrors.resume = "Please upload your resume PDF or DOC file.";
            }
        }

        if (step === 2) {
            if (!formData.coverLetterFile) {
                newErrors.coverLetter = "Please upload your cover letter file.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setErrors({});
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "resume") {
                setFormData((prev) => ({ ...prev, resumeFile: file }));
                setErrors((prev) => ({ ...prev, resume: "" }));
            } else {
                setFormData((prev) => ({ ...prev, coverLetterFile: file }));
                setErrors((prev) => ({ ...prev, coverLetter: "" }));
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(2)) return;

        setIsSubmitting(true);

        try {
            const resumeData = new FormData();
            const coverLetterData = new FormData();

            resumeData.append("pdf", formData.resumeFile);
            coverLetterData.append("pdf", formData.coverLetterFile);

            const uploadRes1 = await fetch(
                "http://localhost:5001/api/media/pdf",
                {
                    method: "POST",
                    body: resumeData,
                }
            );
            const resumeFile = await uploadRes1.json();

            const uploadRes2 = await fetch(
                "http://localhost:5001/api/media/pdf",
                {
                    method: "POST",
                    body: coverLetterData,
                }
            );
            const coverLetterFile = await uploadRes2.json();

            if (!resumeFile.fileId || !coverLetterFile.fileId) {
                throw new Error("File upload failed");
            }
            const payload = {
                ...job,
                resume: resumeFile.fileId,
                coverLetter: coverLetterFile.fileId,
            };
            await applyjob(payload);
            handleClose();
        } catch (error) {
            console.error("Application Failed:", error);
            alert(
                "Something went wrong uploading your files. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ resumeFile: null, coverLetterFile: null });
        setCurrentStep(1);
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 animate-slide-up">
                <div className="bg-emerald-600 p-6 rounded-t-xl relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Apply for Position
                    </h2>
                    <p className="text-emerald-50">{job.title}</p>

                    <div className="flex items-center gap-4 mt-6">
                        <StepIndicator
                            number={1}
                            label="Resume"
                            active={currentStep === 1}
                            completed={currentStep > 1}
                        />
                        <div
                            className={`flex-1 h-1 rounded ${
                                currentStep > 1
                                    ? "bg-white"
                                    : "bg-white bg-opacity-30"
                            }`}
                        ></div>
                        <StepIndicator
                            number={2}
                            label="Cover Letter"
                            active={currentStep === 2}
                            completed={false}
                        />
                    </div>
                </div>

                <div className="p-6">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-slide-up">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Upload Resume
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Please provide your resume in PDF or Word
                                    format.
                                </p>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) =>
                                            handleFileChange(e, "resume")
                                        }
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label
                                        htmlFor="resume-upload"
                                        className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                            formData.resumeFile
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-gray-300 hover:border-emerald-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {formData.resumeFile ? (
                                            <>
                                                <FileText
                                                    className="text-emerald-500"
                                                    size={48}
                                                />
                                                <div className="text-center">
                                                    <p className="font-bold text-emerald-700">
                                                        {
                                                            formData.resumeFile
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-emerald-600 mt-1">
                                                        {(
                                                            formData.resumeFile
                                                                .size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                </div>
                                                <p className="text-xs text-emerald-500 mt-2 font-medium">
                                                    Click to change file
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload
                                                    className="text-gray-400"
                                                    size={48}
                                                />
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-700 text-lg">
                                                        Click to upload Resume
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        PDF, DOC, or DOCX (Max
                                                        5MB)
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {errors.resume && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">
                                        {errors.resume}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-slide-up">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Upload Cover Letter
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Please provide your cover letter.
                                </p>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) =>
                                            handleFileChange(e, "coverLetter")
                                        }
                                        className="hidden"
                                        id="cover-upload"
                                    />
                                    <label
                                        htmlFor="cover-upload"
                                        className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                            formData.coverLetterFile
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-gray-300 hover:border-emerald-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {formData.coverLetterFile ? (
                                            <>
                                                <FileText
                                                    className="text-emerald-500"
                                                    size={48}
                                                />
                                                <div className="text-center">
                                                    <p className="font-bold text-emerald-700">
                                                        {
                                                            formData
                                                                .coverLetterFile
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-emerald-600 mt-1">
                                                        {(
                                                            formData
                                                                .coverLetterFile
                                                                .size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                </div>
                                                <p className="text-xs text-emerald-500 mt-2 font-medium">
                                                    Click to change file
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload
                                                    className="text-gray-400"
                                                    size={48}
                                                />
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-700 text-lg">
                                                        Click to upload Cover
                                                        Letter
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        PDF, DOC, or DOCX (Max
                                                        5MB)
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {errors.coverLetter && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">
                                        {errors.coverLetter}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end mt-8 pt-6 border-t">
                        {currentStep === 1 ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                                >
                                    Next Step
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StepIndicator = ({ number, label, active, completed }) => (
    <div className="flex items-center gap-2">
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                completed
                    ? "bg-white text-emerald-500"
                    : active
                      ? "bg-white text-emerald-500"
                      : "bg-white bg-opacity-30 text-white"
            }`}
        >
            {completed ? <CheckCircle size={20} /> : number}
        </div>
        <span
            className={`font-medium hidden sm:inline ${
                active || completed
                    ? "text-white"
                    : "text-white text-opacity-70"
            }`}
        >
            {label}
        </span>
    </div>
);

const style = document.createElement("style");
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
`;
document.head.appendChild(style);
