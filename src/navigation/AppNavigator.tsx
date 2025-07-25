// src/navigation/AppNavigator.tsx
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const { colors } = useTheme();
  
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.drawerBackground }}>
      <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
        <Image source={require('../assets/images/cinema.png')} style={styles.logo} />
        <Text style={[styles.headerTitle, { color: colors.drawerText }]}>Movie App</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const CustomHeader = ({ navigation, title }: any) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.headerContainer, { 
      backgroundColor: colors.headerBackground,
      borderBottomColor: colors.border 
    }]}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Icon name="menu" size={24} color={colors.headerText} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: colors.headerText }]}>{title}</Text>
      <View style={styles.headerRight} />
    </View>
  );
};

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: 280, backgroundColor: colors.drawerBackground },
        drawerActiveTintColor: colors.drawerActiveTint,
        drawerInactiveTintColor: colors.drawerInactiveTint,
        header: ({ navigation, route }) => (
          <CustomHeader navigation={navigation} title={route.name} />
        ),
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Accueil',
          drawerIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{
          title: 'Détails',
          drawerItemStyle: { display: 'none' }, 
        }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          title: 'Paramètres',
          drawerIcon: ({ color }) => (
            <Icon name="settings" size={24} color={color} />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  menuButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerRight: {
    width: 24,
  },
});

export default AppNavigator;