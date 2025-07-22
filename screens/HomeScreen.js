// screens/HomeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SWIPE_THRESHOLD = 120;

// Define interest categories
const SOCIAL_INTERESTS = [
  'Clubbing', 'Raving', 'Drinking', 'Shopping', 'Sports', 'Gaming', 
  'Music', 'Dance', 'Photography', 'Travel', 'Outdoors', 'Cooking',
  'Boba', 'Cycling', 'Art', 'Books'
];

const PROFESSIONAL_INTERESTS = [
  'Tech', 'Finance', 'AI', 'Robotics', 'Design', 'Marketing',
  'Entrepreneurship', 'Consulting', 'Medicine', 'Law', 'Engineering',
  'Research', 'Academia', 'Startup', 'Investment Banking', 'Data Science'
];

export default function HomeScreen({ profiles = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState(profiles || []);
  const [activeTab, setActiveTab] = useState('social'); // 'social' or 'professional'
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Swipe right (like)
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Swipe left (pass)
        forceSwipe('left');
      } else {
        // Return to center
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? screenWidth : -screenWidth;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete());
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const onSwipeComplete = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  // Filter profiles based on active tab
  useEffect(() => {
    const relevantInterests = activeTab === 'social' ? SOCIAL_INTERESTS : PROFESSIONAL_INTERESTS;
    const tabFilteredProfiles = profiles.filter(profile => {
      const profileInterests = activeTab === 'social' 
        ? (profile.socialInterests || profile.interests || [])
        : (profile.professionalInterests || profile.interests || []);
      
      return profileInterests.some(interest => 
        relevantInterests.some(relevant => 
          relevant.toLowerCase() === interest.toLowerCase()
        )
      );
    });
    
    setFilteredProfiles(tabFilteredProfiles);
    setCurrentIndex(0);
    setSelectedInterests([]);
  }, [activeTab, profiles]);

  const getCurrentInterests = () => {
    return activeTab === 'social' ? SOCIAL_INTERESTS : PROFESSIONAL_INTERESTS;
  };

  const allInterests = getCurrentInterests();

  const applyFilter = () => {
    const relevantInterests = getCurrentInterests();
    let baseProfiles = profiles.filter(profile => {
      const profileInterests = activeTab === 'social' 
        ? (profile.socialInterests || profile.interests || [])
        : (profile.professionalInterests || profile.interests || []);
      
      return profileInterests.some(interest => 
        relevantInterests.some(relevant => 
          relevant.toLowerCase() === interest.toLowerCase()
        )
      );
    });

    if (selectedInterests.length === 0) {
      setFilteredProfiles(baseProfiles);
    } else {
      const filtered = baseProfiles.filter(profile => {
        const profileInterests = activeTab === 'social' 
          ? (profile.socialInterests || profile.interests || [])
          : (profile.professionalInterests || profile.interests || []);
        
        return profileInterests.some(interest =>
          selectedInterests.includes(interest)
        );
      });
      setFilteredProfiles(filtered);
    }
    setCurrentIndex(0);
    setShowFilter(false);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const renderProfileCard = (profile, index) => {
    if (index < currentIndex) return null;
    if (index === currentIndex) {
      // Active card
      return (
        <Animated.View
          key={profile.id}
          style={[
            styles.card,
            {
              transform: [
                ...position.getTranslateTransform(),
                { rotate },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <ProfileCardContent profile={profile} />
        </Animated.View>
      );
    } else {
      // Background cards
      return (
        <View key={profile.id} style={[styles.card, { zIndex: -index }]}>
          <ProfileCardContent profile={profile} />
        </View>
      );
    }
  };

  const ProfileCardContent = ({ profile }) => {
    const displayInterests = activeTab === 'social' 
      ? (profile.socialInterests || profile.interests || [])
      : (profile.professionalInterests || profile.interests || []);

    const displayBio = activeTab === 'social' 
      ? (profile.socialBio || profile.bio || '')
      : (profile.professionalBio || profile.bio || '');

    return (
      <>
        {profile.photo && (
          <Image source={{ uri: profile.photo }} style={styles.profileImage} />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}, {profile.age}</Text>
          {profile.school && (
            <Text style={styles.school}>{profile.school}</Text>
          )}
          {profile.location && (
            <Text style={styles.location}>{profile.location}</Text>
          )}
          {displayBio && <Text style={styles.bio}>{displayBio}</Text>}
          {displayInterests.length > 0 && (
            <View style={styles.interestsContainer}>
              {displayInterests.map((interest, idx) => (
                <View key={idx} style={[
                  styles.interestTag,
                  activeTab === 'professional' && styles.professionalTag
                ]}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </>
    );
  };

  if (currentIndex >= filteredProfiles.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Friend Link</Text>
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Ionicons name="filter" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
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

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more profiles to show!</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setCurrentIndex(0);
              setFilteredProfiles(profiles || []);
              setSelectedInterests([]);
            }}
          >
            <Text style={styles.resetButtonText}>Reset Stack</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friend Link</Text>
        <TouchableOpacity onPress={() => setShowFilter(true)}>
          <Ionicons name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
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

      <View style={styles.cardContainer}>
        {filteredProfiles.map((profile, index) => renderProfileCard(profile, index))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => forceSwipe('left')}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <Ionicons name="heart" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filter by {activeTab === 'social' ? 'Social' : 'Professional'} Interests
              </Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={allInterests}
              numColumns={2}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.interestButton,
                    selectedInterests.includes(item) && styles.selectedInterest
                  ]}
                  onPress={() => toggleInterest(item)}
                >
                  <Text style={[
                    styles.interestButtonText,
                    selectedInterests.includes(item) && styles.selectedInterestText
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSelectedInterests([])}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilter}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
  position: 'absolute',
  top: screenHeight * 0.001, // Adjust this to move the card lower
  width: screenWidth - 40,
  height: screenHeight * 0.6,
  backgroundColor: 'white',
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 2,
  overflow: 'hidden',
},

  profileImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  profileInfo: {
    padding: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  school: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 2,
  },
  professionalTag: {
    backgroundColor: '#34C759',
  },
  interestText: {
    color: 'white',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 50,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#34C759',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: 'white',
    width: screenWidth * 0.85,
    maxHeight: screenHeight * 0.7,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  interestButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedInterest: {
    backgroundColor: '#007AFF',
  },
  interestButtonText: {
    color: '#333',
  },
  selectedInterestText: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});