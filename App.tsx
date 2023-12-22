/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  // // DebugInstructions,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import EventSenderComponent from './EventSenderComponent';

import {
  DatadogProvider,
  DdSdkReactNative,
  DdSdkReactNativeConfiguration,
} from '@datadog/mobile-react-native';

import Config from 'react-native-config';

console.log(`>>>> Datadog env: ${Config.DATADOG_ENVIRONMENT}`);

const config = new DdSdkReactNativeConfiguration(
  Config.DATADOG_CLIENT_TOKEN || '',
  Config.DATADOG_ENVIRONMENT || '',
  Config.DATADOG_APPLICATION_ID || '',
  true, // track User interactions (e.g.: Tap on buttons. You can change it based on your needs)
  true, // track XHR Resources
  true, // track Errors
);

DdSdkReactNative.initialize(config).then(() => {
  DdSdkReactNative.setUser({
    id: '1337',
    name: 'John Doe',
    email: 'john.doe@example.com',
    // Additional user properties can be added here.
  });
});

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <DatadogProvider configuration={config}>
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </View>
    </DatadogProvider>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <EventSenderComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

export default App;

export default App;
