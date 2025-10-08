import React, { useState } from "react";
import { emergencyAPI } from "../services/api";
import { toast } from "react-toastify";
import "./EmergencyRequestForm.css";

const EmergencyRequestForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    emergencyType: "safety",
    description: "",
    priority: "high",
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.success("Location detected successfully!");
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get location. Please allow location access.");
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error("Please allow location access before submitting");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        ...formData,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };

      const response = await emergencyAPI.createRequest(requestData);

      if (response.data.success) {
        toast.success("Emergency request sent! Help is on the way.");
        toast.info(
          `Notified ${response.data.data.notifiedCount.total} helpers nearby`
        );

        // Reset form
        setFormData({
          userName: "",
          userPhone: "",
          emergencyType: "safety",
          description: "",
          priority: "high",
        });
        setLocation(null);
      }
    } catch (error) {
      console.error("Error creating emergency request:", error);
      toast.error(
        error.response?.data?.message || "Failed to send emergency request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emergency-form-container">
      <div className="emergency-form-card">
        <h1 className="form-title">🚨 Emergency Request</h1>
        <p className="form-subtitle">
          We'll immediately alert nearby NGOs and volunteers to help you
        </p>

        <form onSubmit={handleSubmit} className="emergency-form">
          <div className="form-group">
            <label htmlFor="userName">Your Name *</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userPhone">Phone Number *</label>
            <input
              type="tel"
              id="userPhone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleInputChange}
              required
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyType">Emergency Type *</label>
            <select
              id="emergencyType"
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleInputChange}
              required
            >
              <option value="safety">Safety Concern</option>
              <option value="violence">Violence</option>
              <option value="medical">Medical Emergency</option>
              <option value="accident">Accident</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Describe your emergency situation..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority Level</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="location-section">
            <button
              type="button"
              onClick={getLocation}
              disabled={gettingLocation}
              className="location-btn"
            >
              {gettingLocation ? "Getting Location..." : "📍 Get My Location"}
            </button>
            {location && (
              <p className="location-status">
                ✅ Location detected: {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !location}
            className="submit-btn"
          >
            {loading ? "Sending..." : "Send Emergency Request"}
          </button>
        </form>

        <div className="help-info">
          <p>
            🔒 Your location will only be shared with verified NGOs and
            volunteers nearby
          </p>
          <p>📱 You will receive SMS updates on your phone</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestForm;
