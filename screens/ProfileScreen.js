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
import { useFocusEffect } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config'; // Adjust path as needed
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
  const [user, setUser] = useState(null);

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

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Reload profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        loadProfile(user.uid);
      }
    }, [user?.uid])
  );

  const loadProfile = async (userId) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      console.log('Loading profile for user:', userId);
      
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Loaded profile data:', data);
        
        // Ensure photo arrays are properly initialized
        const updatedData = {
          ...data,
          socialPhotos: data.socialPhotos || [null, null, null, null, null],
          professionalPhotos: data.professionalPhotos || [null, null, null, null, null],
        };
        
        setProfileData(prevData => ({ ...prevData, ...updatedData }));
        console.log('Profile data updated in state');
      } else {
        console.log('No profile found for user, starting with default data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Don't show alert for offline errors, just log them
      if (error.code !== 'failed-precondition' && error.code !== 'unavailable') {
        Alert.alert('Error', 'Failed to load profile. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhotoToStorage = async (photoUri, userId, photoType, index) => {
    try {
      // Validate photo URI
      if (!photoUri || typeof photoUri !== 'string') {
        throw new Error('Invalid photo URI');
      }

      // Convert URI to blob
      const response = await fetch(photoUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create storage reference
      const photoRef = ref(storage, `profiles/${userId}/${photoType}_${index}_${Date.now()}.jpg`);
      
      // Upload to Firebase Storage
      const uploadResult = await uploadBytes(photoRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  // Auto-save validation function
  const validateRequiredFields = () => {
    if (!profileData.name.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return false;
    }
    if (!profileData.age.trim()) {
      Alert.alert('Required Field', 'Please enter your age');
      return false;
    }
    return true;
  };

  const uploadPhotosInBackground = async (userId, photoType, photos) => {
    // Don't await this function - let it run completely in the background
    setTimeout(async () => {
      try {
        const uploadPromises = [];
        const photoData = [...photos];

        // Upload photos for the specific type
        photos.forEach((photo, index) => {
          if (photo && typeof photo === 'string' && (photo.startsWith('file://') || photo.startsWith('content://'))) {
            uploadPromises.push(
              uploadPhotoToStorage(photo, userId, photoType, index)
                .then(url => {
                  photoData[index] = url;
                  console.log(`${photoType} photo ${index} uploaded successfully`);
                })
                .catch(error => {
                  console.error(`Error uploading ${photoType} photo ${index}:`, error);
                  // Keep the original URI if upload fails
                  photoData[index] = photo;
                })
            );
          }
        });

        // Wait for all photo uploads to complete (with timeout)
        if (uploadPromises.length > 0) {
          try {
            await Promise.race([
              Promise.all(uploadPromises),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Upload timeout')), 30000) // 30 second timeout
              )
            ]);
            
            // Update local state with the uploaded photo URLs
            setProfileData(prevData => ({
              ...prevData,
              [photoType]: photoData
            }));
            
            // Update Firestore with the uploaded photo URLs
            const updatedData = {
              [photoType]: photoData.filter(photo => photo !== null),
              updatedAt: new Date()
            };
            
            await setDoc(doc(db, 'profiles', userId), updatedData, { merge: true });
            console.log(`All ${photoType} photos uploaded and profile updated`);
          } catch (timeoutError) {
            console.log(`${photoType} photo upload timeout or error, continuing without waiting`);
            // Don't fail the entire process if uploads timeout
          }
        }
      } catch (error) {
        console.error(`Error uploading ${photoType} photos in background:`, error);
        // Don't show alerts for background upload errors
      }
    }, 100); // Small delay to ensure save completes first
  };

  const updateProfileData = async (key, value) => {
    console.log(`Updating ${key}:`, value);
    // Update local state immediately
    setProfileData(prev => ({ ...prev, [key]: value }));
    
    // Auto-save to Firebase
    await autoSaveToFirebase(key, value);
  };

  const autoSaveToFirebase = async (key, value) => {
    try {
      const userId = user?.uid;
      if (!userId) {
        console.log('No user ID available for saving');
        return;
      }

      // Create update object with just the changed field
      const updateData = {
        [key]: value,
        updatedAt: new Date()
      };

      // Special handling for photo arrays
      if (key === 'socialPhotos' || key === 'professionalPhotos') {
        // Filter out null photos
        updateData[key] = value.filter(photo => photo !== null);
        
        // Check if there are new photos to upload
        const hasNewPhotos = value.some(photo => 
          photo && typeof photo === 'string' && (photo.startsWith('file://') || photo.startsWith('content://'))
        );

        if (hasNewPhotos) {
          // Upload photos in background
          uploadPhotosInBackground(userId, key, value);
        }
      }

      // Save to Firestore
      await setDoc(doc(db, 'profiles', userId), updateData, { merge: true });
      console.log(`Auto-saved ${key}:`, value);
    } catch (error) {
      console.error(`Error auto-saving ${key}:`, error);
      // Don't show alerts for auto-save errors to avoid spam
    }
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
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

        {/* Auto-save status indicator */}
        <View style={styles.autoSaveIndicator}>
          <Text style={styles.autoSaveText}>
            ✓ Auto-saving enabled
          </Text>
        </View>

        <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
  autoSaveIndicator: {
    backgroundColor: '#e8f5e8',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  autoSaveText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 30,
  },
});