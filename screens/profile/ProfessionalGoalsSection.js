import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PROFESSIONAL_GOAL_OPTIONS = ['Networking', 'Collaborating', 'Mentorship', 'Career Change'];
const INDUSTRY_OPTIONS = ['Tech', 'Startups', 'Finance', 'Healthcare'];

export default function ProfessionalGoalsSection({ 
  professionalGoals, 
  industryInterests, 
  onProfessionalGoalsChange, 
  onIndustryInterestsChange 
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
      <Text style={styles.sectionTitle}>Professional Goals</Text>
      
      <TagsContainer
        items={professionalGoals}
        label="What are you looking for?"
        onPress={() => showMultiSelector(
          'Professional Goals', 
          PROFESSIONAL_GOAL_OPTIONS, 
          professionalGoals, 
          onProfessionalGoalsChange
        )}
      />

      <TagsContainer
        items={industryInterests}
        label="Industry Interests"
        onPress={() => showMultiSelector(
          'Select Industry Interests', 
          INDUSTRY_OPTIONS, 
          industryInterests, 
          onIndustryInterestsChange
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  selectorInput: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});