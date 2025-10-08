import React, { useState, useEffect } from "react";
import { emergencyAPI } from "../services/api";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchData = async () => {
    try {
      // DEMO MODE: Use mock data
      const mockStats = {
        totalRequests: 15,
        pending: 6,
        acknowledged: 3,
        inProgress: 4,
        resolved: 2,
        totalNGOs: 8,
        totalVolunteers: 12,
      };

      const mockRequests = [
        {
          _id: "1",
          userName: "Sarah Johnson",
          userPhone: "+1234567890",
          emergencyType: "medical",
          description:
            "Severe chest pain, difficulty breathing. Need immediate medical assistance.",
          priority: "critical",
          status: "pending",
          location: { address: "MG Road, Bangalore, Karnataka 560001" },
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          userName: "Priya Sharma",
          userPhone: "+9876543210",
          emergencyType: "violence",
          description: "Domestic violence situation, immediate help needed.",
          priority: "high",
          status: "acknowledged",
          location: { address: "Indiranagar, Bangalore, Karnataka 560038" },
          createdAt: new Date(Date.now() - 300000).toISOString(),
        },
        {
          _id: "3",
          userName: "Raj Kumar",
          userPhone: "+9988776655",
          emergencyType: "accident",
          description:
            "Road accident, minor injuries, need transport to hospital.",
          priority: "medium",
          status: "in-progress",
          location: { address: "Koramangala, Bangalore, Karnataka 560034" },
          createdAt: new Date(Date.now() - 600000).toISOString(),
        },
        {
          _id: "4",
          userName: "Anita Desai",
          userPhone: "+9123456789",
          emergencyType: "safety",
          description:
            "Feeling unsafe, being followed. Need immediate assistance.",
          priority: "high",
          status: "pending",
          location: { address: "Whitefield, Bangalore, Karnataka 560066" },
          createdAt: new Date(Date.now() - 900000).toISOString(),
        },
        {
          _id: "5",
          userName: "Kumar Singh",
          userPhone: "+9876512340",
          emergencyType: "medical",
          description:
            "Elderly person fell, possible fracture, needs medical attention.",
          priority: "medium",
          status: "pending",
          location: { address: "Jayanagar, Bangalore, Karnataka 560011" },
          createdAt: new Date(Date.now() - 1200000).toISOString(),
        },
        {
          _id: "6",
          userName: "Meena Patel",
          userPhone: "+9012345678",
          emergencyType: "other",
          description: "Fire in building, need immediate evacuation support.",
          priority: "critical",
          status: "in-progress",
          location: { address: "HSR Layout, Bangalore, Karnataka 560102" },
          createdAt: new Date(Date.now() - 1500000).toISOString(),
        },
      ];

      // Filter requests based on selected filter
      const filteredRequests =
        filter === "all"
          ? mockRequests
          : mockRequests.filter((req) => req.status === filter);

      setStats(mockStats);
      setRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // DEMO MODE: Update local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );
      toast.success(`Status updated to ${newStatus} (Demo Mode)`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "status-badge-pending",
      acknowledged: "status-badge-acknowledged",
      "in-progress": "status-badge-progress",
      resolved: "status-badge-resolved",
      cancelled: "status-badge-cancelled",
    };
    return statusClasses[status] || "";
  };

  const getPriorityBadgeClass = (priority) => {
    const priorityClasses = {
      low: "priority-badge-low",
      medium: "priority-badge-medium",
      high: "priority-badge-high",
      critical: "priority-badge-critical",
    };
    return priorityClasses[priority] || "";
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🎯 Control Room Dashboard</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card stat-pending">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
          <div className="stat-card stat-progress">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
          <div className="stat-card stat-resolved">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolved}</p>
          </div>
          <div className="stat-card stat-recent">
            <h3>Last 24 Hours</h3>
            <p className="stat-number">{stats.last24Hours}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "pending" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={
            filter === "in-progress" ? "filter-btn active" : "filter-btn"
          }
          onClick={() => setFilter("in-progress")}
        >
          In Progress
        </button>
        <button
          className={filter === "resolved" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("resolved")}
        >
          Resolved
        </button>
      </div>

      {/* Emergency Requests List */}
      <div className="requests-container">
        <h2>Emergency Requests</h2>
        {requests.length === 0 ? (
          <p className="no-requests">No requests found</p>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div>
                    <h3>{request.userName}</h3>
                    <p className="request-phone">📱 {request.userPhone}</p>
                  </div>
                  <div className="request-badges">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                    <span
                      className={`priority-badge ${getPriorityBadgeClass(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
                  </div>
                </div>

                <div className="request-details">
                  <p>
                    <strong>Type:</strong>{" "}
                    <span className="emergency-type">
                      {request.emergencyType}
                    </span>
                  </p>
                  <p>
                    <strong>Description:</strong> {request.description}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    <a
                      href={`https://www.google.com/maps?q=${request.location.coordinates[1]},${request.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      View on Map 🗺️
                    </a>
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {formatDistanceToNow(new Date(request.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p>
                    <strong>Notified:</strong>{" "}
                    {request.notifiedNGOs?.length || 0} NGOs,{" "}
                    {request.notifiedVolunteers?.length || 0} Volunteers
                  </p>
                </div>

                <div className="request-actions">
                  {request.status === "pending" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(request._id, "acknowledged")
                      }
                      className="action-btn btn-acknowledge"
                    >
                      Acknowledge
                    </button>
                  )}
                  {(request.status === "pending" ||
                    request.status === "acknowledged") && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(request._id, "in-progress")
                      }
                      className="action-btn btn-progress"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {request.status === "in-progress" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(request._id, "resolved")
                      }
                      className="action-btn btn-resolved"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
