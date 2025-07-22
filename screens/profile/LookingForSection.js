// screens/profile/LookingForSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LOOKING_FOR_OPTIONS = ['Friends to go out with', 'Meeting new people', 'Activity partners', 'Study buddies'];

export default function LookingForSection({ lookingFor, onLookingForChange }) {
  const showMultiSelector = () => {
    Alert.alert(
      'What are you looking for?',
      'Select all that apply',
      LOOKING_FOR_OPTIONS.map(option => ({
        text: `${lookingFor.includes(option) ? '✓ ' : ''}${option}`,
        onPress: () => {
          const newValues = lookingFor.includes(option)
            ? lookingFor.filter(item => item !== option)
            : [...lookingFor, option];
          onLookingForChange(newValues);
        }
      })).concat([{ text: 'Done', style: 'cancel' }])
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Looking For</Text>
      
      <TouchableOpacity style={styles.selectorInput} onPress={showMultiSelector}>
        <Text style={styles.inputLabel}>What are you looking for?</Text>
        <View style={styles.tagsContainer}>
          {lookingFor.map((item, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
            </View>
          ))}
          <Ionicons name="add" size={20} color="#007AFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  selectorInput: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafbfc',
    minHeight: 44,
  },
  tag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
});

