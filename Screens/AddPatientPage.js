import React, { useState, useEffect } from "react";
import {Text, TextInput, StyleSheet, View, Button, ScrollView} from "react-native";
import { Picker } from '@react-native-picker/picker';


export default function AddPatientPage ({route, navigation}) {

    const { lastPatientId, addPatient } = route.params; 
    const [id, setId] = useState("");
    const [name,setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [emrgencyContact, setEmergencyContact] = useState("");
    const [medical, setMedical] = useState("");
    const [allergy, setAllergy] = useState("");
    const [BloodType, setBloodType] = useState("");

    useEffect(() => {
        setId(lastPatientId + 1);  // Increment the last patient’s ID by 1
      }, [lastPatientId]);

    const createNewPatient = () => {

        const newPatient = {
          id,
          name,
          age,
          gender,
          phone,
          emrgencyContact,
          email,
          address,
          medical,
          allergy,
          BloodType,
        };
      
        // Call the addPatient function passed via route.params
        route.params.addPatient(newPatient);
      
        // Navigate back to PatientListPage
        navigation.goBack();

      };

    return (
        <ScrollView contentContainerStyle={style.scrollView}>
        <View>
            <View style={style.View}>
                <Text style={style.label}>Patient ID:</Text>
                {/* Automatically display the ID */}
                <TextInput style={style.value} value={id.toString()} editable={false} />
            </View>
            <View style={style.View}>
                <Text style={style.label}>Full Name:</Text>
                <TextInput placeholder="Enter Name" style={style.value} value={name} onChangeText={setName}/>
            </View>

            <View style={style.View}>
                <Text style={style.label}>Age:</Text>
                <TextInput placeholder="Enter Age" style={style.value} value={age} onChangeText={setAge} keyboardType="numeric"/>
            </View>
            
            {/* Using picker to select the gender */}
            <View style={style.View}>
                <Text style={style.label}>Gender:</Text>
                <Picker selectedValue={gender} style={style.picker} onValueChange={(itemValue) => setGender(itemValue)}>
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                </Picker>
            </View>

            <View style={style.View}>
                <Text style={style.label}>Phone Number:</Text>
                <TextInput placeholder="Enter Number" style={style.value} value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
            </View>

            <View style={style.View}>
                <Text style={style.label}>Emergency Contact:</Text>
                <TextInput placeholder="Enter" style={style.value} value={emrgencyContact} 
                    onChangeText={setEmergencyContact} keyboardType="phone-pad"/>
            </View>
            <View style={style.View}>
                <Text style={style.label}>Email:</Text>
                <TextInput placeholder="Enter Email" style={style.value} value={email} onChangeText={setEmail}/>
            </View>        
           <View style={style.View}>
                <Text style={style.label} >Address:</Text>
                <TextInput placeholder="Enter Address" style={style.value} value={address} onChangeText={setAddress}/>
            </View>        
            <Text style={style.label}>Medical History:</Text>
            <TextInput value={medical} onChangeText={setMedical} style={style.medical} multiline numberOfLines={5}/>

            <Text style={style.label}>Allergies (if Any):</Text>
            <TextInput value={allergy} onChangeText={setAllergy} style={style.medical} multiline numberOfLines={3}/>

            <View style={style.View}>
            <Text style={style.label}>Blood Type:</Text>
            <Picker selectedValue={BloodType} style={style.picker} onValueChange={(itemValue) => setBloodType(itemValue)}>
                    <Picker.Item label="O+" value="O+" />
                    <Picker.Item label="O-" value="O-" />
                    <Picker.Item label="A+" value="A+" />
                    <Picker.Item label="A-" value="A-" />
                    <Picker.Item label="B+" value="B+" />
                    <Picker.Item label="B-" value="B-" />
                    <Picker.Item label="AB+" value="AB+" />
                    <Picker.Item label="AB-" value="AB-" />
                </Picker>
            </View>

            <Button title="Create" onPress={createNewPatient} />
        </View>
        </ScrollView>

    );
}

const style=StyleSheet.create({
    scrollView: {
        padding: 16,
      },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
      },
    value: {
        fontSize: 14,
        marginTop: 2,
        marginHorizontal: 10
      },
    View: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    multilineInput: {
        textAlignVertical: 'top',
    },
      picker: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
      },
      medical: {
        fontSize: 14, 
      }

})