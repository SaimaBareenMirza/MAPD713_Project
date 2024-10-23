import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { Picker } from '@react-native-picker/picker';

export default function AddMeasurementPage({ navigation }) {
    const [ test, setTest ] = useState("");
    const [ value1, setValue1 ] = useState(""); 
    const [ value2, setValue2 ] = useState(""); 
    const [ date, setDate ] = useState(new Date());

    const renderInputFields = () => {
        switch (test) {
            case "Blood Pressure":
                return (
                    <>
                        <View style={styles.View}>
                            <Text style={styles.label}>Enter Sys Value:</Text>
                            <TextInput placeholder="Enter Sys Value" style={styles.value} value={value1} onChangeText={setValue1} keyboardType="numeric" />
                            <Text style={styles.unit}>{"(Unit: mmHg)"}</Text>
                        </View>
                        <View style={styles.View}>
                            <Text style={styles.label}>Enter Dia Value:</Text>
                            <TextInput placeholder="Enter Dia Value" style={styles.value} value={value2} onChangeText={setValue2} keyboardType="numeric" />
                            <Text style={styles.unit}>{"(Unit: mmHg)"}</Text>
                        </View>
                    </>
                );
            case "Respiratory Rate":
                return (
                    <View style={styles.View}>
                        <Text style={styles.label}>Enter Value:</Text>
                        <TextInput placeholder="Enter Value" style={styles.value} value={value1} onChangeText={setValue1} keyboardType="numeric" />
                        <Text style={styles.unit}>{"(Unit: breaths/min)"}</Text>
                    </View>
                );
            case "HeartBeat Rate":
                return (
                    <View style={styles.View}>
                        <Text style={styles.label}>Enter Value:</Text>
                        <TextInput placeholder="Enter Value" style={styles.value} value={value1} onChangeText={setValue1} keyboardType="numeric" />
                        <Text style={styles.unit}>{"(Unit: bpm)"}</Text>
                    </View>
                );
            case "Blood Oxygen Level":
                return (
                    <View style={styles.View}>
                        <Text style={styles.label}>Enter Value:</Text>
                        <TextInput placeholder="Enter Value" style={styles.value} value={value1} onChangeText={setValue1} keyboardType="numeric" />
                        <Text style={styles.unit}>{"(Unit: %)"}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const handleSubmit = () => {
        // TODO: Implement a POST request to submit measurement data
        /*
        const unit = test === "Blood Pressure" ? "mmHg" : 
                     test === "Respiratory Rate" ? "breaths/min" : 
                     test === "HeartBeat Rate" ? "bpm" : 
                     test === "Blood Oxygen Level" ? "%" : "";

        
        const newMeasurement = {
            type: test,
            value: test === "Blood Pressure" ? `${value1}/${value2}` : value1,
            unit: unit,
            dateTime: date.toLocaleString(),
        }; */
        
        navigation.goBack(); 
    };
    

    // To set date and time
    const onChange = (e, selectedDate) => {
        setDate(selectedDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Test:</Text>
            <Picker selectedValue={test} style={styles.picker} onValueChange={(itemValue) => {
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
            <View style={styles.DateTime}>
                <Text style={styles.label}>Test Time:</Text>
                <DateTimePicker 
                    value={date}
                    mode={"date"}
                    is24Hour={true}
                    onChange={onChange}
                />
                <DateTimePicker 
                    value={date}
                    mode={"time"}
                    is24Hour={true}
                    onChange={onChange}
                />
        
            </View>

            <TouchableOpacity 
                onPress={handleSubmit}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Submit Measurement</Text>
            </TouchableOpacity>
        </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 150,
    },
    value: {
        fontSize: 14,
        marginTop: 2,
        marginHorizontal: 10,
        flex: 1,
    },
    unit: {
        fontSize: 14,
    },
    View: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    DateTime: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    dateTimeText: {
        margin: 10
    }
});
