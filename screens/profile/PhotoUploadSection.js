// screens/profile/PhotoUploadSection.js
import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Text, 
  Alert, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const imageSize = width - 32;

export default function PhotoUploadSection({ photos, onPhotosChange, type }) {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need camera roll permissions to upload photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handlePhotoUpload = async (index) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Add Photo',
      'Select a photo source',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(index),
        },
        {
          text: 'Photo Library',
          onPress: () => openImagePicker(index),
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openImagePicker = async (index) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos];
        newPhotos[index] = result.assets[0].uri;
        onPhotosChange(newPhotos);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const openCamera = async (index) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera permissions to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos];
        newPhotos[index] = result.assets[0].uri;
        onPhotosChange(newPhotos);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const PhotoUploadSlot = ({ photo, index, style = {} }) => (
    <TouchableOpacity 
      style={[styles.photoSlot, style]} 
      onPress={() => handlePhotoUpload(index)}
    >
      {photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.uploadedPhoto} />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => {
              const newPhotos = [...photos];
              newPhotos[index] = null;
              onPhotosChange(newPhotos);
            }}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyPhotoSlot}>
          <Ionicons name="camera" size={40} color="#ccc" />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      {photos.map((photo, index) => (
        <PhotoUploadSlot
          key={`${type}-photo-${index}`}
          photo={photo}
          index={index}
          style={[
            styles.mainPhotoSlot,
            index === 0 && styles.firstPhoto
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  photoSlot: {
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
  firstPhoto: {
    marginTop: 0,
  },
  mainPhotoSlot: {
    height: imageSize * 0.8,
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotoSlot: {
    backgroundColor: '#f0f0f0',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});