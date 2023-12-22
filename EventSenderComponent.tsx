import {
  DdRum,
  DdSdkReactNative,
  RumActionType,
} from '@datadog/mobile-react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Define the HistoryEntry type
interface HistoryEntry {
  result: string;
  iterations: number;
  sleepDuration: number;
  duration: number;
  startTime: Date;
}

// Define the InputComponentProps type
type InputComponentProps = {
  value: string;
  onChange: (text: string) => void;
};

// Subcomponent: Number of Iterations
const NbrOfIterationsComponent: React.FC<InputComponentProps> = ({
  value,
  onChange,
}) => (
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
const SleepDurationComponent: React.FC<InputComponentProps> = ({
  value,
  onChange,
}) => (
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

// Subcomponent: Number of Fields
const NbrOfFieldsComponent: React.FC<InputComponentProps> = ({
  value,
  onChange,
}) => (
  <View style={styles.inputContainer}>
    <Text>Number of fields:</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

// Define the StateComponentProps type
type StateComponentProps = {
  isRunning: boolean;
};

// Subcomponent: State
const StateComponent: React.FC<StateComponentProps> = ({isRunning}) => (
  <View style={styles.stateContainer}>
    <Text>State:</Text>
    <Text>{isRunning ? 'Running' : 'Not Running'}</Text>
  </View>
);

// Define the ControlProps type
type ControlProps = {
  onStart: () => void;
  onStop: () => void;
  isRunning: boolean;
};

// Subcomponent: Control
const ControlComponent: React.FC<ControlProps> = ({
  onStart,
  onStop,
  isRunning,
}) => (
  <View style={styles.controlContainer}>
    <Button title="Start" onPress={onStart} disabled={isRunning} />
    <Button title="Stop" onPress={onStop} disabled={!isRunning} />
  </View>
);

// Subcomponent: History List
const HistoryListComponent = ({history}: {history: HistoryEntry[]}) => (
  <ScrollView style={styles.historyList}>
    {history.map((entry, index) => (
      <Text key={index}>
        {`Start date: ${entry.startTime.toISOString()}, Result: ${
          entry.result
        }, Iterations: ${entry.iterations}, Duration: ${
          entry.duration
        }s, Sleep: ${entry.sleepDuration}s`}
      </Text>
    ))}
  </ScrollView>
);

// Main component: EventSender
const EventSenderComponent = () => {
  const [nbrOfIterations, setNbrOfIterations] = useState('10');
  const [sleepDuration, setSleepDuration] = useState('1');
  const [nbrOfFields, setNbrOfFields] = useState('10');
  const [isRunning, setIsRunning] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  interface ExecutionResult {
    executionStatus: string;
    lastIteration: number;
  }

  const shouldStopRef = useRef(false);

  useEffect(() => {
    shouldStopRef.current = shouldStop;
  }, [shouldStop]);

  const generateAttributes = (numberOfFields: number) => {
    const attributes = {};
    for (let i = 0; i < numberOfFields; i++) {
      const constantValue = Math.random().toString(36).substring(2, 52);
      attributes[`i-${i}`] = constantValue;
    }
    return attributes;
  };

  const sendEvents2Datadog = async (
    iterations: number,
    sleep: number,
    fields: number,
  ): Promise<ExecutionResult> => {
    // Placeholder for the actual sendEvents2Datadog function
    console.log(
      `Sending ${iterations} events to Datadog with a sleep of ${sleep} seconds each and ${fields} fields.`,
    );
    const startTime = new Date();
    setIsRunning(true);
    // Simulate sending events and sleeping
    for (let i = 1; i <= iterations; i++) {
      if (shouldStopRef.current) {
        return {executionStatus: 'Cancelled', lastIteration: i};
      }
      await new Promise(resolve => {
        setTimeout(resolve, sleep * 1000);
        DdRum.addAction(
          RumActionType.CUSTOM,
          `name-${i}-${startTime.toISOString()}`,
          generateAttributes(fields),
          Date.now(),
        );
      });
    }
    setIsRunning(false);
    setShouldStop(false);
    return {executionStatus: 'Success', lastIteration: iterations}; // Placeholder for the actual result
  };

  const handleStart = () => {
    const iterations = parseInt(nbrOfIterations, 10);
    const sleep = parseInt(sleepDuration, 10);
    const fields = parseInt(nbrOfFields, 10);
    if (iterations > 0 && sleep > 0 && fields > 0) {
      const startTime = new Date();
      DdRum.startView(
        `event-loader-view-${startTime.toISOString()}`, // <view-key> doit être unique, par exemple ViewName-unique-id
        `Event loader view: ${startTime.toISOString()}`,
        {},
        Date.now(),
      );
      sendEvents2Datadog(iterations, sleep, fields).then(result => {
        const duration = (Date.now() - startTime.getTime()) / 1000;
        setHistory(prevHistory => [
          ...prevHistory,
          {
            startTime,
            result: result.executionStatus,
            iterations: result.lastIteration,
            sleepDuration: sleep,
            duration,
          },
        ]);
      });
      DdRum.stopView(`event-loader-view-${startTime.toISOString()}`, {}, Date.now());
    }
  };

  const handleStop = () => {
    // Placeholder for stopping the sendEvents2Datadog function
    setShouldStop(true);
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
      <NbrOfFieldsComponent value={nbrOfFields} onChange={setNbrOfFields} />
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
