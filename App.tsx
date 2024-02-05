/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
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
  ProxyConfiguration,
  ProxyType,
  SdkVerbosity,
  UploadFrequency,
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

config.verbosity = SdkVerbosity.DEBUG;
config.uploadFrequency = UploadFrequency.FREQUENT;

const DD_ENDPOINT = 'https://192.168.1.50:8080';
console.log(`DD_ENDPOINT=${DD_ENDPOINT}`);
console.log(`DATADOG_CLIENT_TOKEN=${Config.DATADOG_CLIENT_TOKEN}`);
console.log(`DATADOG_ENVIRONMENT=${Config.DATADOG_ENVIRONMENT}`);
console.log(`DATADOG_APPLICATION_ID=${Config.DATADOG_APPLICATION_ID}`);
console.log(`DATADOG_PROXY_HOST=${Config.DATADOG_PROXY_HOST}`);
console.log(`DATADOG_PROXY_TYPE=${Config.DATADOG_PROXY_TYPE}`);
console.log(`DATADOG_PROXY_PORT=${Config.DATADOG_PROXY_PORT}`);

config.customEndpoints = {
  rum: DD_ENDPOINT,
  logs: DD_ENDPOINT,
  trace: DD_ENDPOINT,
};

if (
  Config.DATADOG_PROXY_HOST &&
  Config.DATADOG_PROXY_TYPE &&
  Config.DATADOG_PROXY_PORT
) {
  let proxyType: ProxyType;

  switch (Config.DATADOG_PROXY_TYPE) {
    case 'http':
      proxyType = ProxyType.HTTP;
      break;
    case 'https':
      proxyType = ProxyType.HTTPS;
      break;
    case 'socks':
      proxyType = ProxyType.SOCKS;
      break;
    default:
      throw new Error(`Invalid proxy type: ${Config.DATADOG_PROXY_TYPE}`);
  }

  config.proxyConfig = new ProxyConfiguration(
    proxyType,
    Config.DATADOG_PROXY_HOST,
    +Config.DATADOG_PROXY_PORT,
  );
}

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
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://192.168.1.50:3128';

function App(): React.JSX.Element {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error: Error) => {
        console.error('Error:', error);
      });
  }, []);

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
