import React, { useState } from 'react';
import { Alert, Switch, Button, StyleSheet, Text, View, TextInput } from 'react-native';
import styled from "styled-components";
import { getProvidesAudioData } from 'expo/build/AR';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
     this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}

export default function App() {
  const [state, onChangeText] = useState({
    odLength: '',
    idLength: '',
    weight: '',
    thickness: '',
    width: '',
    density: '',
    length: '',
    area: ''
  });
  const [system, setSystem] = useState(false);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    let conversionConstant = system ? 100 : 12;

    let flODLength = parseFloat(state.odLength);
    let flIDLength = parseFloat(state.idLength);
    let flWeight = parseFloat(state.weight);
    let flThickness = parseFloat(state.thickness);
    let flWidth = parseFloat(state.width);
    let flDensity = parseFloat(state.density);
    let flLength = parseFloat(state.length);
    let flArea = parseFloat(state.area);

    let idWeightCalc = flDensity * Math.PI * Math.pow(flIDLength/2,2) * flWidth;

    let odCalc = 2*Math.sqrt((flWeight + idWeightCalc)/(Math.PI*flDensity*flWidth))
    if (!Number.isNaN(odCalc)) {
      flODLength = odCalc;
    } else {
      flODLength = state.odLength;
    }
    
    let weightCalc = flDensity*Math.PI*Math.pow(flODLength/2,2)*flWidth - idWeightCalc;
    if (!Number.isNaN(weightCalc)) {
      flWeight = weightCalc;
    } else {
      flWeight = state.weight;
    }
    
    let thicknessCalc = flWeight / (conversionConstant * flLength * flDensity * flWidth);
    if (!Number.isNaN(thicknessCalc)) {
      flThickness = thicknessCalc;
    } else {
      flThickness = state.thickness;
    }

    let widthCalc = flWeight / (conversionConstant * flLength * flDensity * flThickness);
    if (!Number.isNaN(widthCalc)) {
      flWidth = widthCalc;
    } else {
      flWidth = state.width;
    }
    
    let lengthCalc = flWeight / (flDensity * flWidth *flThickness * conversionConstant);
    if (!Number.isNaN(lengthCalc) && Number.isFinite(lengthCalc)) {
      flLength = lengthCalc;
    } else {
      flLength = state.length;
    }

    let areaCalc = flWeight / (flThickness * conversionConstant * flDensity);
    if (!Number.isNaN(areaCalc) && Number.isFinite(areaCalc)) {
      flArea = areaCalc;
    } else {
      flArea = state.area;
    }

    onChangeText({
      ...state,
      odLength: Number(flODLength).toFixed(3),
      width: Number(flWeight).toFixed(3),
      thickness: Number(flThickness).toFixed(3),
      width: Number(flWidth).toFixed(3),
      length: Number(flLength).toFixed(3),
      area: Number(flArea).toFixed(3)
    })
    
  }

  const handleReset = (ev) => {
    ev.preventDefault();
    onChangeText({
      odLength: '',
      odWeight: '',
      idLength: '',
      weight: '',
      thickness: '',
      width: '',
      density: '',
      length: '',
      area: ''
    });
  }

  const toggleSwitch = (ev) => {
    setSystem(previousState => !previousState);
    handleReset(ev);
  }

  return (
    <View style={styles.container}>
      <ErrorBoundary>
        <View style={styles.formItem}>
          <Text style={{textAlignVertical: "center", fontSize: 20, fontWeight: 'bold', height: 50}}>Aluminum Coil Calculator</Text>
        </View>

        <View style={styles.formItem}>
          <Text style={{textAlignVertical: "center"}}>Imperial</Text>
          <Switch
            value={system}
            onChange={toggleSwitch}
          />
          <Text style={{textAlignVertical: "center"}}>Metric</Text>
        </View>

        <View style={styles.formItem}> 
          <Text style={styles.label}>Outer Diameter {system ? "(cm)" : "(in)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="OD length"
            keyboardType='decimal-pad'
            value={state.odLength}
            onChangeText={text => onChangeText({...state, odLength: text})}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Inner Diameter {system ? "(cm)" : "(in)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="ID length"
            keyboardType='decimal-pad'
            value={state.idLength}
            onChangeText={text => onChangeText({...state, idLength: text})}
          />
        </View> 
        <View style={styles.formItem}>
          <Text style={styles.label}>Weight {system ? "(kg)" : "(lbs)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            keyboardType='decimal-pad'
            value={state.weight}
            onChangeText={text => onChangeText({...state, weight: text})}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Thickness {system ? "(cm)" : "(in)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Thickness"
            keyboardType='decimal-pad'
            value={state.thickness}
            onChangeText={text => onChangeText({...state, thickness: text})}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Width {system ? "(cm)" : "(in)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Width"
            keyboardType='decimal-pad'
            value={state.width}
            onChangeText={text => onChangeText({...state, width: text})}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Density {system ? "(g/cu cm)" : "(lbs/cu in)"}</Text>
          <TextInput
            style={styles.input}
            placeholder={system ? '2.720' : '0.098'}
            keyboardType='decimal-pad'
            value={state.density}
            onChangeText={text => onChangeText({...state, density: text})}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Length {system ? "(m)" : "(ft)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Length"
            keyboardType='decimal-pad'
            value={state.length}
            onChangeText={text => onChangeText({...state, length: text})}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Area {system ? "(sq m)" : "(sq ft)"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Area"
            keyboardType='decimal-pad'
            value={state.area}
            onChangeText={text => onChangeText({...state, area: text})}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <Button
            title="Submit"
            onPress={handleSubmit}
          />
        </View>
        
        <Button color="red" onPress={handleReset} title="Reset"/>
        
        
        
      </ErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 30,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formItem: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff", 
    height: 50
  },
  label: {
    width: '50%',
    textAlign: "right",
    textAlignVertical: "center",
    fontWeight: 'bold'
  },
  input: {
    width: '50%',
    marginLeft: 10
  },
});
