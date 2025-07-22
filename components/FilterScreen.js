// components/FilterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';
import { allInterests } from '../data/profilesDB';

export default function FilterScreen({ route, navigation }) {
  const { selectedInterests: initialSelected, setSelectedInterests } = route.params;
  
  const [localSelected, setLocalSelected] = useState(initialSelected || []);
  
  const toggleInterest = (interest) => {
    if (localSelected.includes(interest)) {
      setLocalSelected(localSelected.filter((i) => i !== interest));
    } else {
      setLocalSelected([...localSelected, interest]);
    }
  };
  
  const applyFilters = () => {
    setSelectedInterests(localSelected);
    navigation.goBack();
  };
  
  const clearFilters = () => {
    setLocalSelected([]);
  };
  
  const renderItem = ({ item }) => {
    const isSelected = localSelected.includes(item);
    return (
      <TouchableOpacity
        style={[styles.tag, isSelected && styles.tagSelected]}
        onPress={() => toggleInterest(item)}
      >
        <Text style={[
          styles.tagText,
          isSelected && styles.tagTextSelected
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Interests</Text>
      <Text style={styles.subtitle}>
        {localSelected.length === 0 
          ? 'No filters selected (showing all profiles)' 
          : `${localSelected.length} interest${localSelected.length !== 1 ? 's' : ''} selected`
        }
      </Text>
      
      <FlatList
        data={allInterests}
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60, 
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  tag: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  tagText: {
    color: '#495057',
    fontWeight: '500',
    textAlign: 'center',
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});