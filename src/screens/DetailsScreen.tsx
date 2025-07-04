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
  StatusBar
} from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

interface Props {
  route: DetailsScreenRouteProp;
}

interface MediaDetails {
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  first_air_date?: string;
  release_date?: string;
}

const API_KEY = '38ae107a8c0cf4141d09d2c6a7210e7e';
const BASE_URL = 'https://api.themoviedb.org/3';

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { id, type } = route.params;
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=fr-FR`
        );
        
        if (response.status === 200) {
          setDetails(response.data);
        } else {
          setError(`Erreur: ${response.status}`);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur détaillée:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text>Aucune donnée disponible</Text>
      </View>
    );
  }

  const releaseYear = details.release_date 
    ? new Date(details.release_date).getFullYear() 
    : details.first_air_date 
    ? new Date(details.first_air_date).getFullYear() 
    : 'N/A';

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.container}>
        {/* Backdrop Image with Back Button */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w1280${details.backdrop_path || details.poster_path}` }}
            style={styles.backdrop}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            {details.title || details.name} 
            <Text style={styles.year}> ({releaseYear})</Text>
          </Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={16} color="#f1c40f" />
              <Text style={styles.ratingText}>{details.vote_average.toFixed(1)}</Text>
            </View>
            <View style={[styles.typeBadge, type === 'movie' ? styles.movieBadge : styles.tvBadge]}>
              <Text style={styles.typeText}>
                {type === 'movie' ? 'FILM' : 'SÉRIE'}
              </Text>
            </View>
          </View>

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            {details.genres?.length > 0 && (
              <View style={styles.metaItem}>
                <Icon name="film" size={16} color="#3498db" />
                <Text style={styles.metaText}>
                  {details.genres.slice(0, 2).map(g => g.name).join(', ')}
                  {details.genres.length > 2 ? '...' : ''}
                </Text>
              </View>
            )}
            
            {type === 'movie' && details.runtime && (
              <View style={styles.metaItem}>
                <Icon name="time" size={16} color="#3498db" />
                <Text style={styles.metaText}>{formatRuntime(details.runtime)}</Text>
              </View>
            )}
            
            {type === 'tv' && details.number_of_seasons && (
              <View style={styles.metaItem}>
                <Icon name="tv" size={16} color="#3498db" />
                <Text style={styles.metaText}>
                  {details.number_of_seasons} saison{details.number_of_seasons > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
          
          {/* Synopsis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.overview}>
              {details.overview || 'Aucun synopsis disponible.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  backdropContainer: {
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  year: {
    color: '#7f8c8d',
    fontWeight: 'normal',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9e7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  movieBadge: {
    backgroundColor: '#e8f4f8',
  },
  tvBadge: {
    backgroundColor: '#f5e8f8',
  },
  typeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#3498db',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#f1f1f1',
    paddingBottom: 5,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DetailsScreen;