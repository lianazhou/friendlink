// navigation/Tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function Tabs({ profiles, refreshProfiles }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home">
        {() => <HomeScreen profiles={profiles} />}
      </Tab.Screen>
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen refreshProfiles={refreshProfiles} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
