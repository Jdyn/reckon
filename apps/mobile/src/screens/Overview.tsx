import {OverviewStackScreenProps} from '../navigation/tabs/OverviewTab';
import {SafeAreaView, Text, View} from 'react-native';

export default function OverviewScreen({
  navigation,
}: OverviewStackScreenProps<'Overview'>) {
  return (
    <SafeAreaView>
      <Text>Hello World</Text>
    </SafeAreaView>
  );
}
