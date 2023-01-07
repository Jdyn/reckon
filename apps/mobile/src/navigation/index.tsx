import {NavigatorScreenParams} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import DrawerNavigator, {DrawerNavParamList} from './DrawerNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen
        name="Root"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<DrawerNavParamList>;
  NotFound: undefined;
  // Modals
  Search: undefined;
  // Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export default RootNavigator;
