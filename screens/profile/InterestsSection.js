// screens/profile/InterestsSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INTEREST_OPTIONS = ['Coffee', 'Hiking', 'Photography', 'Travel', 'Music', 'Art'];
const HOBBY_OPTIONS = ['Reading', 'Gaming', 'Cooking', 'Gardening', 'Painting', 'Writing'];

export default function InterestsSection({ 
  interests, 
  hobbies, 
  onInterestsChange, 
  onHobbiesChange 
}) {
  const showMultiSelector = (title, options, selectedValues, setSelectedValues) => {
    Alert.alert(
      title,
      'Select all that apply',
      options.map(option => ({
        text: `${selectedValues.includes(option) ? '✓ ' : ''}${option}`,
        onPress: () => {
          const newValues = selectedValues.includes(option)
            ? selectedValues.filter(item => item !== option)
            : [...selectedValues, option];
          setSelectedValues(newValues);
        }
      })).concat([{ text: 'Done', style: 'cancel' }])
    );
  };

  const TagsContainer = ({ items, onPress, label }) => (
    <TouchableOpacity style={styles.selectorInput} onPress={onPress}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.tagsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
        <Ionicons name="add" size={20} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
      
      <TagsContainer
        items={interests}
        label="Interests"
        onPress={() => showMultiSelector(
          'Select Interests', 
          INTEREST_OPTIONS, 
          interests, 
          onInterestsChange
        )}
      />

      <TagsContainer
        items={hobbies}
        label="Hobbies"
        onPress={() => showMultiSelector(
          'Select Hobbies', 
          HOBBY_OPTIONS, 
          hobbies, 
          onHobbiesChange
        )}
      />
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