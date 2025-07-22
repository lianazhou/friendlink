import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SOCIAL_PROMPTS = ["What I love most", "My simple pleasures"];
const PROFESSIONAL_PROMPTS = ["My biggest professional goal", "I'm passionate about"];

export default function PromptSection({
  selectedPrompt,
  promptResponse,
  onPromptChange,
  onResponseChange,
  type
}) {
  const prompts = type === 'social' ? SOCIAL_PROMPTS : PROFESSIONAL_PROMPTS;

  const showSelector = () => {
    Alert.alert(
      'Select Prompt',
      '',
      prompts.map(prompt => ({
        text: prompt,
        onPress: () => onPromptChange(prompt)
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Prompt</Text>
        <TouchableOpacity onPress={showSelector} style={styles.changeButton}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={showSelector} style={styles.promptContainer}>
        <Text style={styles.promptText}>{selectedPrompt}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Response</Text>
      <TextInput
        style={styles.textInput}
        value={promptResponse}
        onChangeText={onResponseChange}
        placeholder="Write your response..."
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  changeButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  promptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  promptText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
  },
});