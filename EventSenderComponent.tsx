import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Subcomponent: Number of Iterations
const NbrOfIterationsComponent = ({value, onChange}) => (
  <View style={styles.inputContainer}>
    <Text>Number of iterations:</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

// Subcomponent: Sleep Duration
const SleepDurationComponent = ({value, onChange}) => (
  <View style={styles.inputContainer}>
    <Text>Sleep duration (s):</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

// Subcomponent: State
const StateComponent = ({isRunning}) => (
  <View style={styles.stateContainer}>
    <Text>State:</Text>
    <View
      style={[
        styles.stateSquare,
        {backgroundColor: isRunning ? 'green' : 'red'},
      ]}
    />
  </View>
);

// Subcomponent: Control
const ControlComponent = ({onStart, onStop, isRunning}) => (
  <View style={styles.controlContainer}>
    <Button title="Start" onPress={onStart} disabled={isRunning} />
    <Button title="Stop" onPress={onStop} disabled={!isRunning} />
  </View>
);

// Subcomponent: History List
const HistoryListComponent = ({history}) => (
  <ScrollView style={styles.historyList}>
    {history.map((entry, index) => (
      <Text key={index}>
        {`Result: ${entry.result}, Iterations: ${entry.iterations}, Duration: ${entry.duration}s, Sleep: ${entry.sleepDuration}s`}
      </Text>
    ))}
  </ScrollView>
);

// Main component: EventSender
const EventSenderComponent = () => {
  const [nbrOfIterations, setNbrOfIterations] = useState('0');
  const [sleepDuration, setSleepDuration] = useState('0');
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);

  const sendEvents2Datadog = async (iterations, sleep) => {
    // Placeholder for the actual sendEvents2Datadog function
    console.log(
      `Sending ${iterations} events to Datadog with a sleep of ${sleep} seconds each.`,
    );
    setIsRunning(true);
    // Simulate sending events and sleeping
    for (let i = 0; i < iterations; i++) {
      await new Promise(resolve => setTimeout(resolve, sleep * 1000));
    }
    setIsRunning(false);
    return 'Success'; // Placeholder for the actual result
  };

  const handleStart = () => {
    const iterations = parseInt(nbrOfIterations, 10);
    const sleep = parseInt(sleepDuration, 10);
    if (iterations > 0 && sleep > 0) {
      const startTime = Date.now();
      sendEvents2Datadog(iterations, sleep).then(result => {
        const duration = (Date.now() - startTime) / 1000;
        setHistory([
          ...history,
          {result, iterations, sleepDuration: sleep, duration},
        ]);
      });
    }
  };

  const handleStop = () => {
    // Placeholder for stopping the sendEvents2Datadog function
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      <NbrOfIterationsComponent
        value={nbrOfIterations}
        onChange={setNbrOfIterations}
      />
      <SleepDurationComponent
        value={sleepDuration}
        onChange={setSleepDuration}
      />
      <StateComponent isRunning={isRunning} />
      <ControlComponent
        onStart={handleStart}
        onStop={handleStop}
        isRunning={isRunning}
      />
      <HistoryListComponent history={history} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginLeft: 10,
    width: 100,
  },
  stateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stateSquare: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  historyList: {
    maxHeight: 200,
  },
});

export default EventSenderComponent;
