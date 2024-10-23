import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { Picker } from '@react-native-picker/picker';

export default function AddMeasurementPage({ route, navigation }) {
    const { addMeasurement } = route.params; // Get the function passed from PatientDetailPage
    const [test, setTest] = useState("");
    const [value1, setValue1] = useState(""); 
    const [value2, setValue2] = useState(""); 
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');

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

    {const handleSubmit = () => {
        const unit = test === "Blood Pressure" ? "mmHg" : 
                     test === "Respiratory Rate" ? "breaths/min" : 
                     test === "HeartBeat Rate" ? "bpm" : 
                     test === "Blood Oxygen Level" ? "%" : "";

        
        const newMeasurement = {
            type: test,
            value: test === "Blood Pressure" ? `${value1}/${value2}` : value1,
            unit: unit,
            dateTime: date.toLocaleString(),
        };
        addMeasurement(newMeasurement); 
        navigation.goBack(); 
    };
    

    //To set date and time
    const onChange = (e, selectedDate) => {
        setDate(selectedDate);
        setShow(false);
      };
    
      const showMode =(modeToShow) => {
        setShow(true);
        setMode(modeToShow);
      }

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
            <View style={style.DateTime}>
            <Button title="Show date" onPress={() => showMode("date")} />
            <Button title="Show time" onPress={() => showMode("time")} />
        {
          show && (
            <DateTimePicker 
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )
        }
        
            </View>
            <Text style={style.dateTimeText}>{date.toLocaleString()}</Text>

            <Button title="Submit Measurement" onPress={handleSubmit} />
        </View>
    ); 
}
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
    DateTime: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: 'grey',
        padding: 'auto'
    },
    dateTimeText: {
        marginVertical: '20', 
        margin: 20
    }
});
