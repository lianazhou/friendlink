import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function ProfileCard({ profile, onPressAsk }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: `https://randomuser.me/api/portraits/lego/${profile.id % 10}.jpg` }} style={styles.photo} />
      <Text style={styles.name}>{profile.name}, {profile.age}</Text>
      <Text style={styles.location}>{profile.location}</Text>
      <Text style={styles.interestsTitle}>Interests:</Text>
      {profile.interests.length > 0 ? (
        profile.interests.map((interest, idx) => (
          <Text key={idx} style={styles.interest}>• {interest}</Text>
        ))
      ) : (
        <Text style={styles.interest}>No interests listed</Text>
      )}
      <Button title="Ask me a question" onPress={onPressAsk} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  location: { fontSize: 16, marginBottom: 12, color: 'gray' },
  interestsTitle: { fontWeight: 'bold', marginBottom: 6 },
  interest: { fontSize: 14, marginLeft: 8 },
});
