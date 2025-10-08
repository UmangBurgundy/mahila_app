import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

interface NotificationData {
  _id: string;
  userName: string;
  emergencyType: string;
  description: string;
  threatLevel: 'low' | 'medium' | 'high' | 'fatal';
  priority: string;
  location: {
    address?: string;
  };
  userPhone: string;
}

interface EmergencyNotificationProps {
  notification: NotificationData;
  onAccept: () => void;
  onReject: () => void;
  onViewDetails: () => void;
  autoAssigned?: boolean;
}

const { width } = Dimensions.get('window');

export default function EmergencyNotification({
  notification,
  onAccept,
  onReject,
  onViewDetails,
  autoAssigned = false,
}: EmergencyNotificationProps) {
  const getThreatColor = (level: string) => {
    switch (level) {
      case 'fatal':
        return '#8B0000'; // Dark red
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'fatal':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      style={[
        styles.container,
        { borderLeftColor: getThreatColor(notification.threatLevel) },
      ]}
    >
      {/* Threat Level Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: getThreatColor(notification.threatLevel) },
        ]}
      >
        <Text style={styles.headerText}>
          {getThreatIcon(notification.threatLevel)} {notification.threatLevel.toUpperCase()} THREAT EMERGENCY
        </Text>
        {autoAssigned && (
          <View style={styles.autoAssignedBadge}>
            <Text style={styles.autoAssignedText}>AUTO-ASSIGNED</Text>
          </View>
        )}
      </View>

      {/* Victim Details */}
      <View style={styles.content}>
        <Text style={styles.title}>🆘 New Emergency Request</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Victim:</Text>
          <Text style={styles.value}>{notification.userName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={[styles.value, styles.emergencyType]}>
            {notification.emergencyType.toUpperCase()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Need:</Text>
          <Text style={styles.value} numberOfLines={2}>
            {notification.description}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value} numberOfLines={2}>
            📍 {notification.location.address || 'Location unavailable'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={[styles.value, styles.phone]}>
            📞 {notification.userPhone}
          </Text>
        </View>

        {/* Priority Badge */}
        <View style={styles.priorityContainer}>
          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor:
                  notification.priority === 'critical'
                    ? '#c0392b'
                    : notification.priority === 'high'
                    ? '#e74c3c'
                    : '#f39c12',
              },
            ]}
          >
            <Text style={styles.priorityText}>
              {notification.priority.toUpperCase()} PRIORITY
            </Text>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
          <Text style={styles.detailsButtonText}>👁️ View Full Details</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        {autoAssigned ? (
          <View style={styles.autoAssignedInfo}>
            <Text style={styles.autoAssignedInfoText}>
              ⚡ You have been automatically assigned to this FATAL emergency.
              Please respond immediately!
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, styles.acknowledgeButton]}
              onPress={onAccept}
            >
              <Text style={styles.actionButtonText}>
                ✓ ACKNOWLEDGE & RESPOND
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={onAccept}
            >
              <Text style={styles.actionButtonText}>✓ Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={onReject}
            >
              <Text style={styles.actionButtonText}>✗ Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Pulsing Border for Fatal */}
      {notification.threatLevel === 'fatal' && (
        <View style={styles.pulsingBorder} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderLeftWidth: 6,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  autoAssignedBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  autoAssignedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    fontWeight: '500',
  },
  emergencyType: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  phone: {
    color: '#3498db',
  },
  priorityContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  acknowledgeButton: {
    backgroundColor: '#27ae60',
    width: '100%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  autoAssignedInfo: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  autoAssignedInfoText: {
    color: '#856404',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  pulsingBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: '#8B0000',
    borderRadius: 12,
    opacity: 0.5,
  },
});
