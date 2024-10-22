import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from "../Components/SearchBar";

export default function PatientListPage({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  
  // Load data from database
  // If it shows Error fetching patients: [TypeError: Network request failed], try changing localhost to IP
  useEffect(() => {
    fetch('http://localhost:3000/patients')
      .then((response) => response.json())
      .then((data) => {
        setPatients(sortPatientsByCondition([...data]));
        setOriginalList(sortPatientsByCondition([...data]));
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  const filterPatients = (nameToSearch) => {
    if (nameToSearch == '') {
      // TODO: Fetch Patients

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
      <Text style={styles.id}>ID: {item.patientId}</Text>
        <Text style={styles.name}>{item.name}</Text>

        {/* Edit Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Patient Detail', { patient: item })}
        >
          <MaterialCommunityIcons name="account-details" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <>
      <View style={styles.container}>
        {/* Add Patient Icon */}
        <View style={styles.addPatientContainer}>
          <TouchableOpacity 
          onPress={() => navigation.navigate('Add Patient')}>
            <Ionicons name="person-add" size={30} color="#007BFF" /> 
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
