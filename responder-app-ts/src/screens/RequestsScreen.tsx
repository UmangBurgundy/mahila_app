import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RequestsScreenProps = {
  navigation: StackNavigationProp<any>;
  route: any;
};

interface EmergencyRequest {
  _id: string;
  userName: string;
  emergencyType: string;
  status: string;
  createdAt: string;
  location: {
    address?: string;
  };
  priority: string;
}

export default function RequestsScreen({ navigation, route }: RequestsScreenProps) {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call
      // Mock data for now
      const mockRequests: EmergencyRequest[] = [
        {
          _id: '1',
          userName: 'Priya Sharma',
          emergencyType: 'safety',
          status: 'pending',
          createdAt: new Date().toISOString(),
          location: { address: 'MG Road, Bangalore' },
          priority: 'high',
        },
        {
          _id: '2',
          userName: 'Anita Desai',
          emergencyType: 'medical',
          status: 'acknowledged',
          createdAt: new Date().toISOString(),
          location: { address: 'Koramangala, Bangalore' },
          priority: 'critical',
        },
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#e74c3c';
      case 'acknowledged':
        return '#f39c12';
      case 'in-progress':
        return '#3498db';
      case 'resolved':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#c0392b';
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

  const renderRequest = ({ item }: { item: EmergencyRequest }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => navigation.navigate('RequestDetail', { request: item })}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestName}>{item.userName}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.requestInfo}>
        <Text style={styles.emergencyType}>
          🚨 {item.emergencyType.toUpperCase()}
        </Text>
        <Text style={styles.location}>📍 {item.location.address || 'Unknown location'}</Text>
        <Text style={styles.time}>
          ⏰ {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading emergency requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e74c3c']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No emergency requests at the moment</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  list: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestInfo: {
    marginBottom: 10,
  },
  emergencyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  time: {
    fontSize: 12,
    color: '#95a5a6',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
});
