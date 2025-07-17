import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Share,
  FlatList
} from 'react-native';
import axios from 'axios';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API_KEY, BASE_URL } from '@env';

// Types
interface MediaDetails {
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  genre_ids?: number[];
  runtime?: number;
  number_of_seasons?: number;
  first_air_date?: string;
  release_date?: string;
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

interface Credit {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  media_type?: string;
  poster_path: string;
}

type Props = {
  route: RouteProp<RootStackParamList, 'Details'>;
};



const DetailsScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { id, type } = route.params;

  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [credits, setCredits] = useState<{ cast: Credit[] }>({ cast: [] });
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [filters, setFilters] = useState({ genre: '', year: '', rating: 0 });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [detailsRes, videosRes, creditsRes, recommendationsRes] = await Promise.all([
          axios.get(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=fr-FR`),
          axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=fr-FR`),
          axios.get(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}&language=fr-FR`)
        ]);

        setDetails({ ...detailsRes.data, videos: videosRes.data });
        setCredits(creditsRes.data);
        setRecommendations(recommendationsRes.data.results.slice(0, 5));
        await storeData(`media-${type}-${id}`, detailsRes.data);

        const watchlist = await getData('watchlist') || [];
        setIsWatchlisted(watchlist.some((item: any) => item.id === id));
      } catch (err: any) {
        const cached = await getData(`media-${type}-${id}`);
        if (cached) setDetails(cached);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, type]);

  const storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Découvrez "${details?.title || details?.name}" : ${details?.overview}`,
        url: `https://www.themoviedb.org/${type}/${id}`
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleWatchlist = async () => {
    const current = await getData('watchlist') || [];
    const newList = isWatchlisted
      ? current.filter((item: any) => item.id !== id)
      : [...current, { id, type, title: details?.title || details?.name }];
    await storeData('watchlist', newList);
    setIsWatchlisted(!isWatchlisted);
  };

  const openTrailer = (trailerKey: string) => {
    Linking.openURL(`https://youtube.com/watch?v=${trailerKey}`);
  };

  const openJustWatch = (title: string) => {
    const query = encodeURIComponent(title);
    Linking.openURL(`https://www.justwatch.com/fr/recherche?q=${query}`);
  };

  const releaseYear = details?.release_date
    ? new Date(details.release_date).getFullYear()
    : details?.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : 'N/A';

  const formatRuntime = (minutes: number = 0) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const trailer = details?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');

  if (loading) return <ActivityIndicator size="large" style={styles.loadingContainer} />;
  if (error) return <Text style={styles.errorText}>Erreur: {error}</Text>;
  if (!details) return <Text>Aucune donnée disponible</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w1280${details.backdrop_path || details.poster_path}` }}
            style={styles.backdrop}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Icon name="share-social" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {details.title || details.name}
            <Text style={styles.year}> ({releaseYear})</Text>
          </Text>

          <View style={styles.actionRow}>
            {trailer && (
              <TouchableOpacity style={[styles.actionButton, styles.trailerButton]} onPress={() => openTrailer(trailer.key)}>
                <Icon name="play" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Bande-annonce</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.watchButton]}
              onPress={() => openJustWatch(details.title || details.name || '')}>
              <Icon name="play-circle" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Regarder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.watchlistButton,
                isWatchlisted && styles.watchlistButtonActive
              ]}
              onPress={toggleWatchlist}>
              <Icon name={isWatchlisted ? "bookmark" : "bookmark-outline"} size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{isWatchlisted ? "Listée" : "Ma liste"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#f1c40f" />
              <Text style={styles.ratingText}>{details.vote_average.toFixed(1)}/10</Text>
            </View>

            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{type === 'movie' ? 'FILM' : 'SÉRIE'}</Text>
            </View>

            {details.runtime && (
              <View style={styles.metaItem}>
                <Icon name="time-outline" size={16} color="#3498db" />
                <Text style={styles.metaText}>{formatRuntime(details.runtime)}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribution</Text>
            <FlatList
              horizontal
              data={credits.cast.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={styles.castItem}>
                  <Image
                    source={{ uri: item.profile_path ? `https://image.tmdb.org/t/p/w200${item.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image' }}
                    style={styles.castImage}
                  />
                  <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.castList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.overview}>{details.overview || 'Aucun synopsis disponible.'}</Text>
          </View>

          {recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommandations</Text>
              <FlatList
                horizontal
                data={recommendations}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recommendationItem}
                    onPress={() => navigation.push('Details', { id: item.id, type: item.media_type || 'movie' })}>
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                      style={styles.recommendationImage}
                    />
                    <Text style={styles.recommendationTitle} numberOfLines={2}>{item.title || item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.recommendationList}
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filtres</Text>
            <View style={styles.filterContainer}>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Genre:</Text>
                <Picker
                  selectedValue={filters.genre}
                  style={styles.filterPicker}
                  onValueChange={(v) => setFilters({ ...filters, genre: v })}>
                  <Picker.Item label="Tous" value="" />
                  {details.genres?.map(g => (
                    <Picker.Item key={g.id} label={g.name} value={g.id.toString()} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  backdropContainer: { position: 'relative', width: '100%', height: 200, marginBottom: 20 },
  backdrop: { width: '100%', height: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  backButton: { position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8, zIndex: 10 },
  shareButton: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  content: { paddingHorizontal: 15, paddingTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  year: { fontSize: 18, color: '#7f8c8d' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, gap: 10 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 8 },
  trailerButton: { backgroundColor: '#e74c3c' },
  watchButton: { backgroundColor: '#3498db' },
  watchlistButton: { backgroundColor: '#7f8c8d' },
  watchlistButtonActive: { backgroundColor: '#27ae60' },
  actionButtonText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
  metaContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginVertical: 10 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  ratingText: { marginLeft: 5, fontWeight: 'bold', color: '#34495e' },
  typeBadge: { backgroundColor: '#2980b9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  typeText: { color: '#fff', fontWeight: 'bold' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  metaText: { marginLeft: 5, color: '#34495e' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  castList: { paddingLeft: 10 },
  castItem: { width: 100, marginRight: 15, alignItems: 'center' },
  castImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 5 },
  castName: { fontWeight: 'bold', textAlign: 'center' },
  castCharacter: { fontSize: 12, color: '#7f8c8d', textAlign: 'center' },
  overview: { fontSize: 14, lineHeight: 20, color: '#2c3e50' },
  recommendationList: { paddingLeft: 10 },
  recommendationItem: { width: 120, marginRight: 15 },
  recommendationImage: { width: 120, height: 180, borderRadius: 8, marginBottom: 5 },
  recommendationTitle: { fontSize: 14, color: '#2c3e50' },
  filterContainer: { backgroundColor: '#ecf0f1', borderRadius: 8, padding: 10 },
  filterItem: { marginBottom: 10 },
  filterLabel: { fontWeight: 'bold', marginBottom: 5 },
  filterPicker: { height: 50, width: '100%' }
});

export default DetailsScreen;
