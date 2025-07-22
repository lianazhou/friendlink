// components/ProfileList.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileCard from './ProfileCard';
import { getProfilesExcludingOwner, generateRandomProfiles } from '../data/profilesDB';

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [filterText, setFilterText] = useState('');
  
  useEffect(() => {
    // Load initial profiles
    const initialProfiles = getProfilesExcludingOwner();
    // If we don't have many profiles, generate some random ones
    if (initialProfiles.length < 10) {
      generateRandomProfiles(20);
    }
    setProfiles(getProfilesExcludingOwner());
  }, []);
  
  const refreshProfiles = () => {
    setProfiles(getProfilesExcludingOwner());
  };
  
  // Filter by name, location, school, or interests
  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(filterText.toLowerCase()) ||
    p.location.toLowerCase().includes(filterText.toLowerCase()) ||
    p.school.toLowerCase().includes(filterText.toLowerCase()) ||
    p.interests.some(i => i.toLowerCase().includes(filterText.toLowerCase()))
  );
  
  const handleAskQuestion = (profile) => {
    // Placeholder for future messaging functionality
    console.log(`Ask question to ${profile.name}`);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Search by name, location, school, or interest..."
          value={filterText}
          onChangeText={setFilterText}
        />
        <TouchableOpacity style={styles.refreshButton} onPress={refreshProfiles}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProfileCard 
            profile={item} 
            onPressAsk={() => handleAskQuestion(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {filtered.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResults}>No profiles found</Text>
          <Text style={styles.noResultsSubtext}>
            Try adjusting your search terms
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderColor: '#dee2e6',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});