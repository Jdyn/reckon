import {SafeAreaView, Text, View} from 'react-native';
import {OverviewStackScreenProps} from '../navigation/tabs/OverviewTab';

export default function OverviewScreen({
  navigation,
}: OverviewStackScreenProps<'Overview'>) {
  return (
    <SafeAreaView>
      <Text>Hello World</Text>
    </SafeAreaView>
  );
}
