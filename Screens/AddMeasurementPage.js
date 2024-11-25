import React, { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, View, Button, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { Picker } from '@react-native-picker/picker';

export default function AddMeasurementPage({ route, navigation }) {
    const [ test, setTest ] = useState("");
    const [ value1, setValue1 ] = useState(""); 
    const [ value2, setValue2 ] = useState(""); 
    const [ date, setDate ] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState("date");
    const { patientId } = route.params;
    
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

    const handleSubmit = async () => {
        // Check all fields are filled in
        if (!test || !value1 || (test === "Blood Pressure" && !value2)) {
            alert("Please fill in all required fields.");
            return;
        }

        let formattedValue = value1;
            
        if (test === "Blood Pressure") {
            formattedValue = `${value1}/${value2} mmHg`;
        } else if (test === "Respiratory Rate") {
            formattedValue = `${value1} breaths/min`
        } else if (test === "HeartBeat Rate") {
            formattedValue = `${value1} bpm`
        } else if (test === "Blood Oxygen Level") {
            formattedValue = `${value1} %`
        }

        const newMeasurement = {
            patient_id: patientId,
            type: test,
            value: formattedValue,
            dateTime: date.toISOString(),
        };
    
        try {
            const response = await fetch("http://192.168.2.49:3000/clinical", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMeasurement),
            });
    
            if (response.ok) {
                Alert.alert("Measurement added successfully.");
                navigation.navigate('Patient Detail', { patientId: patientId, refresh: true });
            } else {
                const errorData = await response.json();
                Alert.alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error adding measurement:", error);
            Alert.alert("Failed to add measurement. Please try again.");
        }
        
        
    };
    const togglePicker = (mode) => {
        setPickerMode(mode);
        setShowPicker(true);
    };

    // To set date and time
    const onChange = (e, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
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
            <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => togglePicker("date")}>
                    <Text style={styles.label}>{`Date: ${date.toLocaleDateString()}`}</Text>
                </TouchableOpacity>
                {/* <Text style={styles.dateTimeText}>{date.toDateString()}</Text> */}
                </View>

                <View style={styles.DateTime}>
                <TouchableOpacity
                    onPress={() => togglePicker("time")}>
                    <Text style={styles.label}>{`Time: ${date.toLocaleTimeString()}`}</Text>
                </TouchableOpacity>
                {/* <Text style={styles.dateTimeText}>
                {`Time: ${date.toLocaleTimeString()}`} */}
                {/* </Text> */}
        
            </View>

                    { showPicker && (
                     <DateTimePicker
                    value={date}
                    mode={pickerMode}
                    is24Hour={true}
                    onChange={onChange} />)}


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