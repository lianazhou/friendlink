// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config'; // Adjust path as needed
import BasicInfoSection from './profile/BasicInfoSection';
import PhotoUploadSection from './profile/PhotoUploadSection';
import InterestsSection from './profile/InterestsSection';
import LookingForSection from './profile/LookingForSection';
import PromptSection from './profile/PromptSection';
import SocialMediaSection from './profile/SocialMediaSection';
import ProfessionalGoalsSection from './profile/ProfessionalGoalsSection';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('social');
  const [isLoading, setIsLoading] = useState(false);

  // Basic Info (shared)
  const [profileData, setProfileData] = useState({
    name: '',
    pronouns: 'They/Them',
    age: '',
    jobTitle: '',
    school: '',
    location: '',
    
    // Social data
    socialPhotos: [null, null, null, null, null],
    socialInterests: [],
    hobbies: [],
    lookingFor: [],
    selectedPrompt: "What I love most",
    promptResponse: "",
    
    // Professional data
    professionalPhotos: [null, null, null, null, null],
    professionalGoals: [],
    industryInterests: [],
    professionalPrompt: "My biggest professional goal",
    professionalPromptResponse: "",
    
    // Social Media
    linkedIn: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData(prevData => ({ ...prevData, ...data }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Error', 'Please log in to save your profile');
        return;
      }

      await setDoc(doc(db, 'profiles', userId), {
        ...profileData,
        updatedAt: new Date(),
        userId
      });
      
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const SocialTabContent = () => (
    <>
      <PhotoUploadSection 
        photos={profileData.socialPhotos}
        onPhotosChange={(photos) => updateProfileData('socialPhotos', photos)}
        type="social"
      />
      <InterestsSection
        interests={profileData.socialInterests}
        hobbies={profileData.hobbies}
        onInterestsChange={(interests) => updateProfileData('socialInterests', interests)}
        onHobbiesChange={(hobbies) => updateProfileData('hobbies', hobbies)}
      />
      <LookingForSection
        lookingFor={profileData.lookingFor}
        onLookingForChange={(lookingFor) => updateProfileData('lookingFor', lookingFor)}
      />
      <PromptSection
        selectedPrompt={profileData.selectedPrompt}
        promptResponse={profileData.promptResponse}
        onPromptChange={(prompt) => updateProfileData('selectedPrompt', prompt)}
        onResponseChange={(response) => updateProfileData('promptResponse', response)}
        type="social"
      />
    </>
  );

  const ProfessionalTabContent = () => (
    <>
      <PhotoUploadSection 
        photos={profileData.professionalPhotos}
        onPhotosChange={(photos) => updateProfileData('professionalPhotos', photos)}
        type="professional"
      />
      <ProfessionalGoalsSection
        professionalGoals={profileData.professionalGoals}
        industryInterests={profileData.industryInterests}
        onProfessionalGoalsChange={(goals) => updateProfileData('professionalGoals', goals)}
        onIndustryInterestsChange={(interests) => updateProfileData('industryInterests', interests)}
      />
      <PromptSection
        selectedPrompt={profileData.professionalPrompt}
        promptResponse={profileData.professionalPromptResponse}
        onPromptChange={(prompt) => updateProfileData('professionalPrompt', prompt)}
        onResponseChange={(response) => updateProfileData('professionalPromptResponse', response)}
        type="professional"
      />
    </>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Basic Info Section - Always on top */}
        <BasicInfoSection
          profileData={profileData}
          onDataChange={updateProfileData}
        />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'social' && styles.activeTab]}
            onPress={() => setActiveTab('social')}
          >
            <Text style={[styles.tabText, activeTab === 'social' && styles.activeTabText]}>
              Social
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'professional' && styles.activeTab]}
            onPress={() => setActiveTab('professional')}
          >
            <Text style={[styles.tabText, activeTab === 'professional' && styles.activeTabText]}>
              Professional
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'social' ? <SocialTabContent /> : <ProfessionalTabContent />}

        {/* Social Media Section (shared) */}
        <SocialMediaSection
          linkedIn={profileData.linkedIn}
          instagram={profileData.instagram}
          twitter={profileData.twitter}
          onLinkedInChange={(value) => updateProfileData('linkedIn', value)}
          onInstagramChange={(value) => updateProfileData('instagram', value)}
          onTwitterChange={(value) => updateProfileData('twitter', value)}
        />

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={saveProfile}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 30,
  },
});