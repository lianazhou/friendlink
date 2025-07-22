// components/ProfileSwiper.js
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export default function ProfileSwiper({ profiles = [], selectedInterests = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const filteredProfiles = useMemo(() => {
    if (!profiles || profiles.length === 0) return [];
    if (selectedInterests.length === 0) return profiles;

    return profiles.filter(profile =>
      profile.interests?.some(interest => selectedInterests.includes(interest))
    );
  }, [profiles, selectedInterests]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          const direction = gesture.dx > 0 ? 'right' : 'left';
          forceSwipe(direction);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const forceSwipe = (direction) => {
    const toValue = direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x: toValue, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    });
  };

  const profile = filteredProfiles[currentIndex];

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProfiles}>No profiles match your selected interests.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, position.getLayout()]}
        key={currentIndex}
      >
        <Image
          source={{ uri: profile.image || `https://randomuser.me/api/portraits/lego/${profile.id % 10}.jpg` }}
          style={styles.photo}
        />
        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={styles.location}>{profile.location}</Text>
        <Text style={styles.school}>{profile.school}</Text>
        <Text style={styles.interestsTitle}>Interests:</Text>
        <View style={styles.interestsContainer}>
          {profile.interests?.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.swipeHint}>Swipe left or right</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => forceSwipe('left')}
        >
          <Ionicons name="close" size={30} color="#ff4458" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <Ionicons name="heart" size={30} color="#4fc3f7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingBottom: 80, // <-- Add bottom padding for tab bar height
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  school: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  interestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  swipeHint: {
    fontSize: 12,
    color: '#aaa',
    fontStyle: 'italic',
  },
  noProfiles: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '60%',
    marginTop: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  passButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4458',
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4fc3f7',
  },
});
