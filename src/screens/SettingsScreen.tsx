import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    wifiOnly: false,
  });

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const settingsOptions = [
    {
      title: "Apparence",
      icon: "color-palette",
      items: [
        {
          label: "Mode sombre",
          icon: "moon",
          value: settings.darkMode,
          onPress: () => toggleSetting('darkMode')
        }
      ]
    },
    {
      title: "Notifications",
      icon: "notifications",
      items: [
        {
          label: "Activer les notifications",
          icon: "notifications",
          value: settings.notifications,
          onPress: () => toggleSetting('notifications')
        },
        {
          label: "Uniquement en Wi-Fi",
          icon: "wifi",
          value: settings.wifiOnly,
          onPress: () => toggleSetting('wifiOnly'),
          disabled: !settings.notifications
        }
      ]
    },
    {
      title: "Compte",
      icon: "person",
      items: [
        {
          label: "Modifier le profil",
          icon: "create",
          action: () => console.log("Navigate to Edit Profile")
        },
        {
          label: "Changer le mot de passe",
          icon: "lock-closed",
          action: () => console.log("Navigate to Change Password")
        }
      ]
    }
  ];

  return (
    <ScrollView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <Text style={[styles.header, settings.darkMode && styles.darkText]}>Paramètres</Text>
      
      {settingsOptions.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon 
              name={section.icon} 
              size={20} 
              color={settings.darkMode ? "#aaa" : "#555"} 
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
              {section.title}
            </Text>
          </View>
          
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity 
              key={itemIndex} 
              onPress={item.onPress || item.action}
              disabled={item.disabled}
              style={[
                styles.settingItem, 
                itemIndex === section.items.length - 1 && styles.lastItem,
                settings.darkMode && styles.darkItem
              ]}
            >
              <View style={styles.settingContent}>
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={settings.darkMode ? "#ddd" : "#2c3e50"} 
                  style={styles.itemIcon}
                />
                <Text style={[
                  styles.settingText, 
                  settings.darkMode && styles.darkText,
                  item.disabled && styles.disabledText
                ]}>
                  {item.label}
                </Text>
              </View>
              
              {item.value !== undefined ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onPress}
                  disabled={item.disabled}
                  thumbColor={Platform.OS === 'android' ? (settings.darkMode ? "#555" : "#f5f5f5") : undefined}
                  trackColor={{
                    false: settings.darkMode ? "#555" : "#f1f1f1",
                    true: settings.darkMode ? "#4a4a4a" : "#81b0ff"
                  }}
                />
              ) : (
                <Icon 
                  name="chevron-forward" 
                  size={20} 
                  color={settings.darkMode ? "#aaa" : "#ccc"} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
      
      <TouchableOpacity style={[styles.logoutButton, settings.darkMode && styles.darkLogoutButton]}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkItem: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkSectionHeader: {
    borderBottomColor: '#333',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  disabledText: {
    color: '#aaa',
  },
  darkText: {
    color: '#fff',
  },
  logoutButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkLogoutButton: {
    backgroundColor: '#1e1e1e',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
});

export default SettingsScreen;