import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';




export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  isFavorite?: boolean;
}


export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  Details: {
    id: number;
    type: 'movie' | 'tv';
    title?: string;
  };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;

export type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export type DrawerScreenNavigationProp = DrawerNavigationProp<RootStackParamList>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}