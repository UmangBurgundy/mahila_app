const NGO = require("../models/NGO");
const Volunteer = require("../models/Volunteer");
const { getDistance } = require("geolib");

/**
 * Find nearby NGOs and Volunteers based on user location
 * @param {Number} longitude - User's longitude
 * @param {Number} latitude - User's latitude
 * @param {String} emergencyType - Type of emergency
 * @param {Number} maxRadius - Maximum search radius in km (default from env)
 * @returns {Object} - Object containing nearby NGOs and volunteers
 */
const findNearbyHelpers = async (
  longitude,
  latitude,
  emergencyType,
  maxRadius = null
) => {
  const searchRadius =
    maxRadius || parseFloat(process.env.MAX_SEARCH_RADIUS_KM) || 50;
  const maxVolunteers = parseInt(process.env.MAX_VOLUNTEERS_TO_NOTIFY) || 5;
  const maxNGOs = parseInt(process.env.MAX_NGOS_TO_NOTIFY) || 3;

  // Convert km to meters for MongoDB geospatial query
  const radiusInMeters = searchRadius * 1000;

  try {
    // Find nearby NGOs using geospatial query
    const nearbyNGOs = await NGO.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
      isActive: true,
      verified: true,
      availability: { $ne: "unavailable" },
      // Filter by service type if available
      ...(emergencyType && { services: emergencyType }),
    })
      .limit(maxNGOs)
      .select(
        "organizationName phone email location services availability capacity"
      );

    // Find nearby volunteers using geospatial query
    const nearbyVolunteers = await Volunteer.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
      isActive: true,
      verified: true,
      availability: "available",
    })
      .limit(maxVolunteers)
      .select("name phone email location skills availability");

    // Calculate actual distances for each helper
    const ngosWithDistance = nearbyNGOs.map((ngo) => ({
      ...ngo.toObject(),
      distanceKm: (
        getDistance(
          { latitude, longitude },
          {
            latitude: ngo.location.coordinates[1],
            longitude: ngo.location.coordinates[0],
          }
        ) / 1000
      ).toFixed(2),
    }));

    const volunteersWithDistance = nearbyVolunteers.map((volunteer) => ({
      ...volunteer.toObject(),
      distanceKm: (
        getDistance(
          { latitude, longitude },
          {
            latitude: volunteer.location.coordinates[1],
            longitude: volunteer.location.coordinates[0],
          }
        ) / 1000
      ).toFixed(2),
    }));

    return {
      ngos: ngosWithDistance,
      volunteers: volunteersWithDistance,
      searchRadius: searchRadius,
      totalFound: ngosWithDistance.length + volunteersWithDistance.length,
    };
  } catch (error) {
    console.error("Error finding nearby helpers:", error);
    throw new Error("Failed to find nearby helpers");
  }
};

/**
 * Calculate distance between two points
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @returns {Number} - Distance in kilometers
 */
const calculateDistance = (point1, point2) => {
  return getDistance(point1, point2) / 1000; // Convert meters to km
};

/**
 * Check if a helper is within their service radius
 * @param {Object} helper - NGO or Volunteer object
 * @param {Number} userLat - User's latitude
 * @param {Number} userLng - User's longitude
 * @returns {Boolean}
 */
const isWithinServiceRadius = (helper, userLat, userLng) => {
  const helperLat = helper.location.coordinates[1];
  const helperLng = helper.location.coordinates[0];

  const distance = calculateDistance(
    { latitude: userLat, longitude: userLng },
    { latitude: helperLat, longitude: helperLng }
  );

  const serviceRadius =
    helper.serviceArea?.radiusKm || helper.availableRadius || 10;

  return distance <= serviceRadius;
};

module.exports = {
  findNearbyHelpers,
  calculateDistance,
  isWithinServiceRadius,
};
