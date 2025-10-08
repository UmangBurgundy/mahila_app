import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RequestDetailScreenProps = {
  navigation: StackNavigationProp<any>;
  route: any;
};

export default function RequestDetailScreen({
  navigation,
  route,
}: RequestDetailScreenProps) {
  const { request } = route.params;
  const [responding, setResponding] = useState(false);

  const handleAccept = () => {
    Alert.alert(
      'Accept Emergency Request',
      'Are you sure you want to accept this emergency request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: async () => {
            setResponding(true);
            // TODO: Implement API call to accept request
            setTimeout(() => {
              setResponding(false);
              Alert.alert('Success', 'You have accepted this emergency request');
              navigation.goBack();
            }, 1000);
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Emergency Request',
      'Are you sure you cannot help with this request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Rejected', 'Request marked as unable to respond');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const openMap = () => {
    const { coordinates } = request.location;
    if (coordinates) {
      const url = `https://www.google.com/maps?q=${coordinates[1]},${coordinates[0]}`;
      Linking.openURL(url);
    }
  };

  const callUser = () => {
    if (request.userPhone) {
      Linking.openURL(`tel:${request.userPhone}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Details</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{request.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Person in Distress</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{request.userName}</Text>
        </View>
        {request.userPhone && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <TouchableOpacity onPress={callUser}>
              <Text style={[styles.value, styles.link]}>{request.userPhone}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={[styles.value, styles.emergencyType]}>
            {request.emergencyType.toUpperCase()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Priority:</Text>
          <Text style={[styles.value, styles.priority]}>
            {request.priority.toUpperCase()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>
            {new Date(request.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      {request.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{request.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.address}>
          {request.location.address || 'Address not available'}
        </Text>
        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <Text style={styles.mapButtonText}>📍 Open in Maps</Text>
        </TouchableOpacity>
      </View>

      {request.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
            disabled={responding}
          >
            <Text style={styles.buttonText}>✓ Accept & Respond</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
            disabled={responding}
          >
            <Text style={styles.buttonText}>✗ Cannot Help</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e74c3c',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#7f8c8d',
    width: 80,
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    fontWeight: '500',
  },
  link: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  emergencyType: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  priority: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  address: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 15,
    lineHeight: 22,
  },
  mapButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    padding: 20,
    gap: 15,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});
