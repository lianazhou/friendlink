// screens/profile/BasicInfoSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRONOUN_OPTIONS = ['He/Him', 'She/Her', 'They/Them', 'Other'];

export default function BasicInfoSection({ profileData, onDataChange }) {
  const showSelector = (title, options, selectedValue, onSelect) => {
    Alert.alert(
      title,
      '',
      options.map(option => ({
        text: option,
        onPress: () => onSelect(option)
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Info</Text>
      
      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, { flex: 2 }]}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.name}
            onChangeText={(value) => onDataChange('name', value)}
            placeholder="Enter your name"
            returnKeyType="done"
          />
        </View>
        
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 12 }]}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.age}
            onChangeText={(value) => onDataChange('age', value)}
            placeholder="25"
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={2}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.selectorInput} 
        onPress={() => showSelector(
          'Select Pronouns', 
          PRONOUN_OPTIONS, 
          profileData.pronouns, 
          (value) => onDataChange('pronouns', value)
        )}
      >
        <Text style={styles.inputLabel}>Pronouns</Text>
        <View style={styles.selectorRow}>
          <Text style={styles.selectorText}>{profileData.pronouns}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Job Title / Role</Text>
        <TextInput
          style={styles.textInput}
          value={profileData.jobTitle}
          onChangeText={(value) => onDataChange('jobTitle', value)}
          placeholder="e.g., Software Developer, Student"
          returnKeyType="done"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>School</Text>
        <TextInput
          style={styles.textInput}
          value={profileData.school}
          onChangeText={(value) => onDataChange('school', value)}
          placeholder="University or School"
          returnKeyType="done"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.textInput}
          value={profileData.location}
          onChangeText={(value) => onDataChange('location', value)}
          placeholder="City, State"
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 20,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
  selectorInput: {
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafbfc',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
});