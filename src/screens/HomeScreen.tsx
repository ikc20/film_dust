import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, MediaItem } from '../navigation/types';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '38ae107a8c0cf4141d09d2c6a7210e7e';
const BASE_URL = 'https://api.themoviedb.org/3';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MediaItem[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [routes] = useState([
    { key: 'movies', title: 'Films' },
    { key: 'series', title: 'Séries' },
    { key: 'favorites', title: 'Favoris' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`),
          axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR`)
        ]);
        
        const moviesWithFavorites = moviesRes.data.results.map((movie: MediaItem) => ({ 
          ...movie, 
          isFavorite: false,
          media_type: 'movie'
        }));
        
        const seriesWithFavorites = seriesRes.data.results.map((serie: MediaItem) => ({ 
          ...serie, 
          isFavorite: false,
          media_type: 'tv'
        }));
        
        setMovies(moviesWithFavorites);
        setFilteredMovies(moviesWithFavorites);
        setSeries(seriesWithFavorites);
        setFilteredSeries(seriesWithFavorites);
      } catch (error) {
        console.error(error); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... (le reste du code reste identique, comme dans votre version originale)

  const renderItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Details', { 
        id: item.id, 
        type: item.media_type || 'movie',
        title: item.title || item.name
      })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
        resizeMode="contain"
      />
      <TouchableOpacity 
        style={styles.favoriteIcon}
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(item);
        }}
      >
        <Icon 
          name={item.isFavorite ? 'favorite' : 'favorite-border'} 
          size={24} 
          color={item.isFavorite ? '#e74c3c' : '#fff'} 
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || item.name}
        </Text>
        <Text style={styles.meta}>
          {item.media_type === 'movie' ? '🎬 Film' : '📺 Série'} • ⭐ {item.vote_average.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const MoviesTab = () => (
    <FlatList
      data={filteredMovies}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun film trouvé</Text>
        </View>
      }
    />
  );

  const SeriesTab = () => (
    <FlatList
      data={filteredSeries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune série trouvée</Text>
        </View>
      }
    />
  );

  const FavoritesTab = () => {
    const favorites = [...movies, ...series].filter(item => item.isFavorite);
    
    return (
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="favorite-border" size={50} color="#95a5a6" />
            <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
            <Text style={styles.emptySubText}>Appuyez sur l'icône ♡ pour ajouter aux favoris</Text>
          </View>
        }
      />
    );
  };

  const renderScene = SceneMap({
    movies: MoviesTab,
    series: SeriesTab,
    favorites: FavoritesTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.label}
      activeColor="#2c3e50"
      inactiveColor="#95a5a6"
      pressOpacity={0.7}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un film ou une série..."
          placeholderTextColor="#95a5a6"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        <Icon name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
      </View>
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
    position: 'relative',
  },
  searchInput: {
    height: 40,
    borderColor: '#ecf0f1',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 15,
    backgroundColor: '#f8f9fa',
    fontSize: 14,
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  list: {
    padding: 8,
  },
  item: {
    flex: 1,
    margin: 6,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  poster: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  indicator: {
    backgroundColor: '#2c3e50',
    height: 3,
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
    textAlign: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
});

export default HomeScreen;

function toggleFavorite(item: MediaItem) {
  throw new Error('Function not implemented.');
}
