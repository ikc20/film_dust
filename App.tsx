import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Image source={require('./src/assets/images/cinema.png')} style={styles.logo} />
      <Text style={styles.headerTitle}>Movie App</Text>
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);
const CustomHeader = ({ navigation, title }: any) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
      <Icon name="menu" size={24} color="#000" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <View style={styles.headerRight} />
</View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: { width: 280, backgroundColor: '#fff' },
          drawerActiveTintColor: '#e74c3c',
          drawerInactiveTintColor: '#333',
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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