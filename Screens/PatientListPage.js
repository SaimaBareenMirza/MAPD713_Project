import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from "../Components/SearchBar";
import { useFocusEffect } from '@react-navigation/native';

export default function PatientListPage({ navigation }) {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ patients, setPatients ] = useState([]);
  const [ originalList, setOriginalList ] = useState([]);
  
  // Load data from database
  // If it shows Error fetching patients: [TypeError: Network request failed], try changing localhost to IP
  const fetchPatients = () => {
    fetch('http://localhost:5000/patients')
      .then((response) => response.json())
      .then((data) => {
        setPatients(sortPatientsByCondition([...data]));
        setOriginalList(sortPatientsByCondition([...data]));
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  // Refresh the patient list when returning to this page
  useFocusEffect(
    React.useCallback(() => {
      fetchPatients();
    }, [])
  );

  const filterPatients = (nameToSearch) => {
    if (nameToSearch == '') {
      // If the search term is empty, reset it as the initial patient list and sort it
      setPatients(sortPatientsByCondition([...originalList]));
    } else {
      // Convert the search term to lower case
      const lowerCaseSearchTerm = nameToSearch.toLowerCase();

      var resultList = originalList.filter((patient) => {
        // Split the patient name to first name and last name
        const [firstName, lastName] = patient.name.toLowerCase().split(' ');

        // Check if the first name and last name match the search term
        return firstName.includes(lowerCaseSearchTerm) || lastName.includes(lowerCaseSearchTerm);
      })
      
      // Filter the list and sort it
      setPatients(sortPatientsByCondition(resultList));
    }
  }

  // Show the Critical status patients first, then stable patients
  const sortPatientsByCondition = (patients) => {
    return patients.sort((a, b) => {
      if (a.condition === 'Critical' && b.condition !== 'Critical') {
        return -1;
      } else if (a.condition !== 'Critical' && b.condition === 'Critical') {
        return 1;
      } else {
        return 0;
      }
    });
  };

  // Render the row
  const renderItem = ({ item }) => (
    <View style={[styles.item, 
      item.condition === 'Critical' ? styles.criticalRow : styles.stableRow]}>
      <View style={styles.row}>
        <Text style={styles.id}>{item.patientId}</Text>
        <Text style={styles.name}>{item.name}</Text>

        {/* Detail Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Patient Detail', { patientId: item._id })}
          accessibilityRole="button"
          accessibilityLabel="account-details"
        >
          <MaterialCommunityIcons name="account-details" size={20} color="#007BFF" testID="account-details" />
        </TouchableOpacity>

        {/* Delete Icon */}
        <TouchableOpacity
          onPress={() => deletePatient(item._id)}
          accessibilityRole="button"
          accessibilityLabel="delete-patient"
        >
          <Ionicons name="trash-bin" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Delete patient
  const deletePatient = (patientId) => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive', // display in red color
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:5000/patients/${patientId}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                // Update the patient list
                setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== patientId));
                Alert.alert('Success', 'Patient deleted successfully.');
              } else {
                Alert.alert('Error', 'Failed to delete patient.');
              }
            } catch (error) {
              console.error('Error deleting patient:', error);
              Alert.alert('Error', 'An error occurred while deleting the patient.');
            }
          },
        },
      ]
    );
  };
  
  return (
    <>
      <View style={styles.container}>
        {/* Add Patient Icon */}
        <View style={styles.addPatientContainer}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Add Patient')}
            accessibilityRole="button"
            accessibilityLabel="person-add"
            testID="person-add"
          >
            <Ionicons name="person-add" size={30} color="#007BFF"/> 
          </TouchableOpacity>
        </View>
        
        {/* Search bar */}
        <SearchBar term={searchTerm}
            onTermChange={(newTerm) => {
                setSearchTerm(newTerm)
                filterPatients(newTerm)
        }} />

        {/* Show the patient list */}
        <FlatList
            data={patients}
            keyExtractor={(item,i) => i}
            renderItem={renderItem}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  addPatientContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 14,
    marginLeft: 10,
  },
  condition: {
    fontSize: 14,
    marginLeft: 10,
  },
  stableRow: {
    backgroundColor: '#d4edda',
  },
  criticalRow: {
    backgroundColor: '#f8d7da',
  },
});