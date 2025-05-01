"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { AlertTriangle, X, Upload, Info, MapPin, DollarSign, Clock, Users } from "lucide-react";

export default function CrisisForm({ onClose }) {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    description: "",
    peopleAffected: "",
    situationRating: 5,
    fundsRequired: "",
    criticalNeeds: ["", "", ""],
    contactEmail: "",
    contactPhone: ""
  });
  const [ngoId, setNgoId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get NGO/user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setNgoId(storedUserId);
    } else {
      alert('No userId found in localStorage!');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCriticalNeedChange = (index, value) => {
    const updatedNeeds = [...formData.criticalNeeds];
    updatedNeeds[index] = value;
    setFormData({ ...formData, criticalNeeds: updatedNeeds });
  };

  const goToNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const goToPrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step 1: Get latitude and longitude from place name
      const geoResponse = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          formData.place
        )}&key=470033735d5b4e50926bd903d53ddabc`
      );
      
      const { results } = geoResponse.data;
      if (!results || results.length === 0) {
        alert('Invalid place. Please try again.');
        setSubmitting(false);
        return;
      }
      
      const { lat, lng } = results[0].geometry;
      
      // Step 2: Create payload and send to backend
      const crisisPayload = {
        name: formData.name,
        place: formData.place,
        description: formData.description,
        peopleAffected: formData.peopleAffected,
        situationRating: formData.situationRating,
        fundsRequired: formData.fundsRequired,
        ngoId,
        latitude: lat,
        longitude: lng,
      };
      
      await axios.post('http://localhost:3002/api/create', crisisPayload);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Error creating crisis. Please try again.');
    }
    
    setSubmitting(false);
  };

  const getSeverityLabel = (value) => {
    if (value <= 3) return "Developing";
    if (value <= 6) return "Moderate";
    if (value <= 8) return "Severe";
    return "Critical";
  };

  const getSeverityColor = (value) => {
    if (value <= 3) return "bg-yellow-500";
    if (value <= 6) return "bg-orange-400";
    if (value <= 8) return "bg-orange-600";
    return "bg-red-600";
  };

  const handleClose = () => {
    // Reset form state
    setActiveStep(1);
    setFormData({
      name: "",
      place: "",
      description: "",
      peopleAffected: "",
      situationRating: 5,
      fundsRequired: "",
      criticalNeeds: ["", "", ""],
      contactEmail: "",
      contactPhone: ""
    });
    setSubmitted(false);
    
    // Call the onClose prop to close the modal
    if (onClose) onClose();
  };

  const handleReportAnother = () => {
    setSubmitted(false);
    setActiveStep(1);
    setFormData({
      name: "",
      place: "",
      description: "",
      peopleAffected: "",
      situationRating: 5,
      fundsRequired: "",
      criticalNeeds: ["", "", ""],
      contactEmail: "",
      contactPhone: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-bold">
              {submitted ? "Crisis Report Submitted" : "Report a Crisis"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Crisis Report Received</h3>
            <p className="text-gray-400 mb-6">
              Thank you for reporting this crisis. Our team will review your submission and respond within 24 hours.
            </p>
            <p className="text-gray-400 mb-6">
              Reference ID: <span className="font-mono text-white">CR-{Math.floor(Math.random() * 1000000)}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClose}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Close
              </button>
              <button
                onClick={handleReportAnother}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Report Another Crisis
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Progress steps */}
            <div className="flex items-center justify-between mb-8">
              <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-yellow-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                  1
                </div>
                <span className="text-xs mt-1">Crisis Details</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-700">
                <div className={`h-full bg-yellow-500 transition-all duration-300`} style={{ width: activeStep >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-yellow-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                  2
                </div>
                <span className="text-xs mt-1">Impact Assessment</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-700">
                <div className={`h-full bg-yellow-500 transition-all duration-300`} style={{ width: activeStep >= 3 ? '100%' : '0%' }}></div>
              </div>
              <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-yellow-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                  3
                </div>
                <span className="text-xs mt-1">Organization Info</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Crisis Details */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Crisis Details</h3>
                    <p className="text-gray-400">Provide essential information about the crisis situation</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Crisis Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Southeast Asia Flooding Crisis"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Location*</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="e.g. Northern Thailand, Chiang Mai Province"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Detailed Description*</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe the crisis situation, its causes, and the current conditions..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Crisis Image</label>
                    <div className="bg-gray-800 border border-gray-700 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <Upload className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-400 mb-1">Drag and drop an image or click to browse</p>
                      <p className="text-gray-500 text-xs">PNG, JPG or JPEG (max. 5MB)</p>
                      <button type="button" className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                        Select Image
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Next: Impact Assessment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Impact Assessment */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Impact Assessment</h3>
                    <p className="text-gray-400">Provide details about the severity and impact of the crisis</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Estimated People Affected*</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="peopleAffected"
                      value={formData.peopleAffected}
                      onChange={handleInputChange}
                      placeholder="e.g. 25,000+"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>Severity Level*</span>
                        </div>
                        <span className={`text-sm font-bold ${
                          formData.situationRating >= 9 ? 'text-red-500' :
                          formData.situationRating >= 7 ? 'text-orange-500' :
                          formData.situationRating >= 4 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {getSeverityLabel(formData.situationRating)} ({formData.situationRating}/10)
                        </span>
                      </div>
                    </label>
                    <input
                      type="range"
                      name="situationRating"
                      min="1"
                      max="10"
                      step="0.1"
                      value={formData.situationRating}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full ${getSeverityColor(formData.situationRating)} transition-all duration-300`}
                        style={{ width: `${(formData.situationRating / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Developing</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                      <span>Critical</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Funding Goal*</span>
                      </div>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-400">$</span>
                      <input
                        type="text"
                        name="fundsRequired"
                        value={formData.fundsRequired}
                        onChange={handleInputChange}
                        placeholder="e.g. 500,000"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-yellow-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Timeline/Urgency</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="e.g. 48 hours critical for rescue operations"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Critical Needs (List top 3)</label>
                    <div className="space-y-2">
                      {formData.criticalNeeds.map((need, index) => (
                        <input
                          key={index}
                          type="text"
                          value={need}
                          onChange={(e) => handleCriticalNeedChange(index, e.target.value)}
                          placeholder={`Need #${index + 1} (e.g. Clean water, Medical supplies)`}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={goToPrevStep}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Next: Organization Info
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Organization Information */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Organization Information</h3>
                    <p className="text-gray-400">Provide details about your organization</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Email*</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="e.g. contact@yourorg.org"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Phone*</label>
                      <input
                        type="text"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. +1 (555) 123-4567"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mt-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        All submissions are reviewed by our team for verification. We may contact you for additional information before publishing your crisis report.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 bg-gray-800 border border-gray-600 rounded focus:ring-yellow-500"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                      I confirm that this information is accurate and I am authorized to report on behalf of my organization
                    </label>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={goToPrevStep}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`${
                        submitting ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                      } text-white px-6 py-3 rounded-lg font-medium flex items-center`}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Submit Crisis Report</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}