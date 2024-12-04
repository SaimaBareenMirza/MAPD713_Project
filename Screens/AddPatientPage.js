import React, { useState } from "react";
import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

export default function AddPatientPage({ navigation }) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [medical, setMedical] = useState("");
    const [allergy, setAllergy] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [photo, setPhoto] = useState(null);

    const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

    const createNewPatient = async() => {
        let photoUrl = null;

        try {
            if (photo) {
                // Create a FormData
                const formData = new FormData();
                formData.append("photo", {
                    uri: photo,
                    name: "patient-photo.jpg", // The file name uploaded to GCP
                    type: "image/jpeg",
                });

                // Upload patient's photo
                const uploadResponse = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Get the photo URL from API
                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(uploadResult.message || "Failed to upload image.");
                }

                // Store the photo URL
                photoUrl = uploadResult.url;
            }

            const response = await fetch("http://localhost:3000/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    age: parseInt(age),
                    gender,
                    admissionDate: new Date().toISOString(), // Assume that the admission date is the date created for the patient
                    phone,
                    email,
                    address,
                    emergencyContactPhone: emergencyContact,
                    medicalHistory: medical,
                    allergies: allergy,
                    bloodType,
                    photoUrl
                })
            });
    
            const result = await response.json();
            
            if (response.ok) {
                Alert.alert(result.message);
                navigation.navigate('Patient List', { newPatient: result.patient });
            } else {
                Alert.alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error creating patient:", error);
            Alert.alert("Failed to create patient. Please try again.");
        }

        navigation.navigate('Patient List', { refresh: true });
        return;
    };

    const pickImage = async () => {
        try {
            // Request to get the permission to access the media library
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            // If the user doesn't grant the permission, return and exit
            if (!permissionResult.granted) {
                alert("Permission to access media library is required!");
                return;
            }

            // If get the permission to access the media library, open it
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only image allow
            });

            // If the user selected a photo, store the uri
            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setPhoto(uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            alert("An error occurred while picking the image.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Upload Photo */}
            <View style={styles.View}>
                {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.uploadButtonText}>Upload Photo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.View}>
                {photo && <Text style={{color: "#007BFF"}}>Upload photo successfully!</Text>}
            </View>
            
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

            {/* Phone number */}
            <View style={styles.View}>
                <Text style={styles.label}>Phone Number:</Text>
                <TextInput placeholder="Enter Number" style={styles.value} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            {/* Emergency Contact */}
            <View style={styles.View}>
                <Text style={styles.label}>Emergency Contact:</Text>
                <TextInput placeholder="Enter Emergency Contact" style={styles.value} value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" />
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
            <TextInput placeholder="Enter Medical History" value={medical} onChangeText={setMedical} style={styles.medical} multiline numberOfLines={5} />

            {/* Allergies */}
            <Text style={styles.label}>Allergies (if Any):</Text>
            <TextInput placeholder="Enter Allergies" value={allergy} onChangeText={setAllergy} style={styles.medical} multiline numberOfLines={3} />

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
    photoContainer: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    uploadButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginVertical: 10,
    },
    uploadButtonText: {
        color: "#fff",
        fontSize: 14,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginVertical: 10,
    },
});