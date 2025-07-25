import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SectionList,
  useColorScheme,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type SettingItem = {
  label: string;
  icon: string;
  value?: boolean;
  onPress: () => void;
  disabled?: boolean;
};

type SettingSection = {
  title: string;
  icon: string;
  data: SettingItem[];
};

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);
  const colorScheme = useColorScheme();

  const toggleSetting = (setting: 'darkMode' | 'notifications' | 'wifiOnly') => {
    switch (setting) {
      case 'darkMode':
        setDarkMode(!darkMode);
        break;
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'wifiOnly':
        setWifiOnly(!wifiOnly);
        break;
    }
  };

  const settingsOptions: SettingSection[] = [
    {
      title: "Apparence",
      icon: "color-palette",
      data: [
        {
          label: "Mode sombre",
          icon: "moon",
          value: darkMode,
          onPress: () => toggleSetting('darkMode'),
        },
      ],
    },
    {
      title: "Notifications",
      icon: "notifications",
      data: [
        {
          label: "Activer les notifications",
          icon: "notifications-outline",
          value: notifications,
          onPress: () => toggleSetting('notifications'),
        },
      ],
    },
    {
      title: "Connexion",
      icon: "wifi",
      data: [
        {
          label: "Wi-Fi uniquement",
          icon: "wifi-outline",
          value: wifiOnly,
          onPress: () => toggleSetting('wifiOnly'),
        },
      ],
    },
  ];

  const renderItem = ({ item }: { item: SettingItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: pressed ? '#f2f2f2' : 'transparent' },
      ]}
      onPress={item.onPress}
    >
      <View style={styles.labelContainer}>
        <Icon name={item.icon} size={20} color="#444" />
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <Switch
        value={item.value}
        onValueChange={item.onPress}
        disabled={item.disabled}
        thumbColor={item.value ? '#007AFF' : '#ccc'}
      />
    </Pressable>
  );

  const renderSectionHeader = ({ section }: { section: SettingSection }) => (
    <View style={styles.sectionHeader}>
      <Icon name={section.icon} size={20} color="#666" />
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <SectionList
      sections={settingsOptions}
      keyExtractor={(item, index) => item.label + index}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
    color: '#444',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: '#222',
  },
});

export default SettingsScreen;
