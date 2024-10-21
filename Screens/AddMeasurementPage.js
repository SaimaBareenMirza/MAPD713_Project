import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';

export default function AddMeasurementPage({ route, navigation }) {
    const { addMeasurement } = route.params; // Get the function passed from PatientDetailPage
    const [test, setTest] = useState("");
    const [value1, setValue1] = useState(""); 
    const [value2, setValue2] = useState(""); 

    const renderInputFields = () => {
        switch (test) {
            case "Blood Pressure":
                return (
                    <View>
                        <Text>Enter Systolic Value:</Text>
                        <TextInput 
                            style={style.input} 
                            value={value1} 
                            onChangeText={setValue1} 
                            keyboardType="numeric"
                        />
                        <Text>Enter Diastolic Value:</Text>
                        <TextInput 
                            style={style.input} 
                            value={value2} 
                            onChangeText={setValue2} 
                            keyboardType="numeric"
                        />
                        <Text>Unit: mmHg</Text>
                    </View>
                );
            case "Respiratory Rate":
                return (
                    <View>
                        <Text>Enter Value:</Text>
                        <TextInput 
                            style={style.input} 
                            value={value1} 
                            onChangeText={setValue1} 
                            keyboardType="numeric"
                        />
                        <Text>Unit: breaths/min</Text>
                    </View>
                );
            case "HeartBeat Rate":
                return (
                    <View>
                        <Text>Enter Value:</Text>
                        <TextInput 
                            style={style.input} value={value1} onChangeText={setValue1} keyboardType="numeric"/>
                        <Text>Unit: bpm</Text>
                    </View>
                );
            case "Blood Oxygen Level":
                return (
                    <View>
                        <Text>Enter Value:</Text>
                        <TextInput 
                            style={style.input} 
                            value={value1} 
                            onChangeText={setValue1} 
                            keyboardType="numeric"
                        />
                        <Text>Unit: %</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const handleSubmit = () => {
        const dateTime = new Date().toLocaleString(); // Get current date/time
        const newMeasurement = {
            type: test,
            value: test === "Blood Pressure" ? `${value1}/${value2}` : value1,
            dateTime: dateTime,
        };
        addMeasurement(newMeasurement); 
        navigation.goBack(); 
    };

    return (
        <View style={style.container}>
            <Text style={style.label}>Select Test:</Text>
            <Picker selectedValue={test} style={style.picker} onValueChange={(itemValue) => {
                setTest(itemValue);
                setValue1(''); // Reset values on test change
                setValue2('');
            }}>
                <Picker.Item label="Select a Test" value="" />
                <Picker.Item label="Blood Pressure" value="Blood Pressure" />
                <Picker.Item label="Respiratory Rate" value="Respiratory Rate" />
                <Picker.Item label="HeartBeat Rate" value="HeartBeat Rate" />
                <Picker.Item label="Blood Oxygen Level" value="Blood Oxygen Level" />
            </Picker>

            {renderInputFields()}

            <Button title="Submit Measurement" onPress={handleSubmit} />
        </View>
    ); 
}

const style = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
