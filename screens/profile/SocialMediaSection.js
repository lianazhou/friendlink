
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SocialMediaSection({ 
  linkedIn, 
  instagram, 
  twitter, 
  onLinkedInChange, 
  onInstagramChange, 
  onTwitterChange 
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Social Media</Text>
      
      <View style={styles.socialMediaItem}>
        <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
        <TextInput
          style={styles.socialMediaInput}
          value={linkedIn}
          onChangeText={onLinkedInChange}
          placeholder="LinkedIn username"
          returnKeyType="done"
        />
      </View>
      
      <View style={styles.socialMediaItem}>
        <Ionicons name="logo-instagram" size={20} color="#E4405F" />
        <TextInput
          style={styles.socialMediaInput}
          value={instagram}
          onChangeText={onInstagramChange}
          placeholder="Instagram handle"
          returnKeyType="done"
        />
      </View>
      
      <View style={styles.socialMediaItem}>
        <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
        <TextInput
          style={styles.socialMediaInput}
          value={twitter}
          onChangeText={onTwitterChange}
          placeholder="Twitter handle"
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
  inputContainer: {
    marginBottom: 16,
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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
  socialMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    backgroundColor: '#fafbfc',
  },
  socialMediaInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingLeft: 12,
  },
});