// components/InterestFilter.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { allInterests } from '../data/profilesDB';

export default function InterestFilter({ selectedInterests, onChange }) {
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter(i => i !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {allInterests.map(interest => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.tag,
              selectedInterests.includes(interest) && styles.tagSelected
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={[
              styles.tagText,
              selectedInterests.includes(interest) && styles.tagTextSelected
            ]}>
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 10,
    backgroundColor: '#f8f9fa'
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  tagSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  tagText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});