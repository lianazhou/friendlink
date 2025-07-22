// data/profilesDB.js

// Consolidated list of all available interests
export const allInterests = [
  'Tech', 'Finance', 'Art', 'Sports', 'Music', 'Travel',
  'AI', 'Robotics', 'Cooking', 'Gaming', 'Books',
  'Photography', 'Outdoors', 'Dance', 'Design', 'Boba', 'Cycling'
];

// Sample profiles with more complete data
const profiles = [
  { 
    id: 1, 
    name: 'Liana', 
    age: 24,
    location: 'San Francisco',
    school: 'UC Berkeley',
    interests: ['Tech', 'Art'], 
    owner: false 
  },
  { 
    id: 2, 
    name: 'Alex', 
    age: 23,
    location: 'New York',
    school: 'NYU',
    interests: ['Finance', 'Sports'], 
    owner: false 
  },
  { 
    id: 3, 
    name: 'Sam', 
    age: 22,
    location: 'Los Angeles',
    school: 'UCLA',
    interests: ['Music', 'Travel'], 
    owner: false 
  },
  { 
    id: 4, 
    name: 'Jordan', 
    age: 25,
    location: 'Chicago',
    school: 'Northwestern',
    interests: ['Gaming', 'AI'], 
    owner: false 
  },
  { 
    id: 5, 
    name: 'Taylor', 
    age: 21,
    location: 'Boston',
    school: 'MIT',
    interests: ['Books', 'Robotics'], 
    owner: false 
  },
  { 
    id: 6, 
    name: 'Casey', 
    age: 26,
    location: 'Seattle',
    school: 'University of Washington',
    interests: ['Cooking', 'Outdoors'], 
    owner: false 
  },
  { 
    id: 7, 
    name: 'Riley', 
    age: 24,
    location: 'Austin',
    school: 'UT Austin',
    interests: ['Photography', 'Dance'], 
    owner: false 
  },
  { 
    id: 8, 
    name: 'Jamie', 
    age: 23,
    location: 'Portland',
    school: 'Portland State',
    interests: ['Design', 'Boba'], 
    owner: false 
  }
];

export function getProfilesExcludingOwner() {
  return profiles.filter(profile => !profile.owner);
}

export function getAllProfiles() {
  return profiles;
}

export function addProfile(profile) {
  const newId = profiles.length ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
  profiles.push({ 
    ...profile, 
    id: newId, 
    owner: true,
    age: parseInt(profile.age) || 18,
    location: profile.location || 'Unknown',
    school: profile.school || 'Unknown'
  });
}

// // Helper function to generate random profiles if needed
// export function generateRandomProfiles(num = 100) {
//   const names = ['Jessie', 'Carlos', 'Aisha', 'Maya', 'Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Sophia'];
//   const locations = ['NY', 'SF', 'LA', 'Chicago', 'Boston', 'Seattle', 'Austin', 'Portland', 'Denver', 'Miami'];
//   const schools = ['Harvard', 'Stanford', 'MIT', 'UCLA', 'NYU', 'Columbia', 'Berkeley', 'Yale', 'Princeton', 'Brown'];
  
//   const generatedProfiles = [];
//   const startId = Math.max(...profiles.map(p => p.id)) + 1;
  
//   for (let i = 0; i < num; i++) {
//     const numInterests = Math.floor(Math.random() * 3) + 1; // 1-3 interests
//     const shuffledInterests = [...allInterests].sort(() => 0.5 - Math.random());
//     const selectedInterests = shuffledInterests.slice(0, numInterests);
    
//     generatedProfiles.push({
//       id: startId + i,
//       name: names[Math.floor(Math.random() * names.length)],
//       age: Math.floor(Math.random() * 15) + 18, // 18-32
//       location: locations[Math.floor(Math.random() * locations.length)],
//       school: schools[Math.floor(Math.random() * schools.length)],
//       interests: selectedInterests,
//       owner: false
//     });
//   }
  
//   profiles.push(...generatedProfiles);
//   return generatedProfiles;
//}