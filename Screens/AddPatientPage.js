import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';

export default function AddPatientPage({ navigation }) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [condition, setCondition] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [medical, setMedical] = useState("");
    const [allergy, setAllergy] = useState("");
    const [bloodType, setBloodType] = useState("");

    const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

    const createNewPatient = () => {
        // TODO: POST request
        navigation.goBack();
        return;
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Name */}
            <View style={styles.View}>
                <Text style={styles.label}>Full Name:</Text>
                <TextInput placeholder="Enter Name" style={styles.value} value={name} onChangeText={setName} />
            </View>

            {/* Age */}
            <View style={styles.View}>
                <Text style={styles.label}>Age:</Text>
                <TextInput placeholder="Enter Age" style={styles.value} value={age} onChangeText={setAge} keyboardType="numeric" />
            </View>

            {/* Gender */}
            <View style={styles.View}>
                <Text style={styles.label}>Gender:</Text>
                <View style={styles.radioContainer}>
                    <CheckBox
                        title="Male"
                        checked={gender === "male"}
                        onPress={() => setGender("male")}
                        containerStyle={styles.checkbox}
                    />
                    <CheckBox
                        title="Female"
                        checked={gender === "female"}
                        onPress={() => setGender("female")}
                        containerStyle={styles.checkbox}
                    />
                    <CheckBox
                        title="Other"
                        checked={gender === "other"}
                        onPress={() => setGender("other")}
                        containerStyle={styles.checkbox}
                    />
                </View>
            </View>

            {/* Condition */}
            <View style={styles.View}>
                <Text style={styles.label}>Condition:</Text>
                <View style={styles.radioContainer}>
                    <CheckBox
                        title="Critical"
                        checked={condition === "Critical"}
                        onPress={() => setCondition("Critical")}
                        containerStyle={styles.checkbox}
                    />
                    <CheckBox
                        title="Stable"
                        checked={condition === "Stable"}
                        onPress={() => setCondition("Stable")}
                        containerStyle={styles.checkbox}
                    />
                </View>
            </View>

            {/* Phone number */}
            <View style={styles.View}>
                <Text style={styles.label}>Phone Number:</Text>
                <TextInput placeholder="Enter Number" style={styles.value} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            {/* Emergency Contact */}
            <View style={styles.View}>
                <Text style={styles.label}>Emergency Contact:</Text>
                <TextInput placeholder="Enter" style={styles.value} value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" />
            </View>

            {/* Email */}
            <View style={styles.View}>
                <Text style={styles.label}>Email:</Text>
                <TextInput placeholder="Enter Email" style={styles.value} value={email} onChangeText={setEmail} />
            </View>

            {/* Address */}
            <View style={styles.View}>
                <Text style={styles.label}>Address:</Text>
                <TextInput placeholder="Enter Address" style={styles.value} value={address} onChangeText={setAddress} />
            </View>

            {/* Medical History */}
            <Text style={styles.label}>Medical History:</Text>
            <TextInput value={medical} onChangeText={setMedical} style={styles.medical} multiline numberOfLines={5} />

            {/* Allergies */}
            <Text style={styles.label}>Allergies (if Any):</Text>
            <TextInput value={allergy} onChangeText={setAllergy} style={styles.medical} multiline numberOfLines={3} />

            {/* Blood Type Dropdown */}
            <Text style={styles.label}>Blood Type:</Text>
            <Picker selectedValue={bloodType} style={styles.picker} onValueChange={(itemValue) => setBloodType(itemValue)} mode="dropdown">
                {bloodTypes.map((type, index) => (
                    <Picker.Item key={index} label={type} value={type} />
                ))}
            </Picker>

            {/* Create Button */}
            <TouchableOpacity style={styles.createButton} onPress={createNewPatient} >
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        marginHorizontal: 10,
        flex: 1,
    },
    View: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    picker: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
    },
    medical: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        minHeight: 100,
        width: '100%',
        textAlignVertical: 'top',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
    },
    createButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 180,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});