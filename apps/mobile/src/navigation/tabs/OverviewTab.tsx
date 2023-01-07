import {CompositeScreenProps} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
// import tw from '~/lib/tailwind';

// import Header from '../../components/header/Header';
import OverviewScreen from '../../screens/Overview';
// import { SharedScreens, SharedScreensParamList } from '../SharedScreens';
import {TabScreenProps} from '../TabNavigator';

const Stack = createNativeStackNavigator<OverviewStackParamList>();

export default function OverviewStack() {
  return (
    <Stack.Navigator
      initialRouteName="Overview"
      screenOptions={{
        headerStyle: {backgroundColor: 'black'},
        // headerTintColor: tw.color('ink'),
        headerTitleStyle: {color: 'white'},
        // headerBackTitleStyle: tw`text-base`
      }}>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      {/* {SharedScreens(Stack as any)} */}
    </Stack.Navigator>
  );
}

export type OverviewStackParamList = {
  Overview: undefined;
};

export type OverviewStackScreenProps<
  Screen extends keyof OverviewStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<OverviewStackParamList, Screen>,
  TabScreenProps<'OverviewStack'>
>;
