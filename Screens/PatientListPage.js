import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from "../Components/SearchBar";

export default function PatientListPage({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [originalList] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 65,
      gender: 'Male',
      admissionDate: '2024-10-01',
      condition: 'Stable',
      phone: '555-1234',
      email: 'johndoe@example.com',
      address: '123 Maple St, Toronto, ON',
      emergencyContactPhone: '555-5678',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '120/80 mmHg',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Respiratory Rate',
          value: '16/min',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '98%',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '72/min',
          dateTime: '2024-10-10 08:00',
        },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 58,
      gender: 'Female',
      admissionDate: '2024-09-20',
      condition: 'Critical',
      phone: '555-2345',
      email: 'janesmith@example.com',
      address: '456 Oak St, Toronto, ON',
      emergencyContactPhone: '555-6789',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '90/60 mmHg',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Respiratory Rate',
          value: '20/min',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '85%',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '110/min',
          dateTime: '2024-10-10 08:00',
        },
      ],
    },
    {
      id: 3,
      name: 'Robert Brown',
      age: 72,
      gender: 'Male',
      admissionDate: '2024-08-15',
      condition: 'Stable',
      phone: '555-3456',
      email: 'robertbrown@example.com',
      address: '789 Pine St, Toronto, ON',
      emergencyContactPhone: '555-7890',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '130/85 mmHg',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Respiratory Rate',
          value: '18/min',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '96%',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '75/min',
          dateTime: '2024-10-10 08:00',
        },
      ],
    },
    {
      id: 4,
      name: 'Emily Davis',
      age: 45,
      gender: 'Female',
      admissionDate: '2024-09-05',
      condition: 'Stable',
      phone: '555-4567',
      email: 'emilydavis@example.com',
      address: '123 Birch St, Toronto, ON',
      emergencyContactPhone: '555-8901',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '110/70 mmHg',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Respiratory Rate',
          value: '15/min',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '97%',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '68/min',
          dateTime: '2024-10-10 08:00',
        },
      ],
    },
    {
      id: 5,
      name: 'Michael Johnson',
      age: 50,
      gender: 'Male',
      admissionDate: '2024-10-02',
      condition: 'Critical',
      phone: '555-5678',
      email: 'michaeljohnson@example.com',
      address: '789 Cedar St, Toronto, ON',
      emergencyContactPhone: '555-9012',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '85/55 mmHg',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Respiratory Rate',
          value: '22/min',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '82%',
          dateTime: '2024-10-10 08:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '115/min',
          dateTime: '2024-10-10 08:00',
        },
      ],
    },
    {
      id: 6,
      name: 'Olivia Wilson',
      age: 45,
      gender: 'Female',
      admissionDate: '2024-09-18',
      condition: 'Stable',
      phone: '555-6789',
      email: 'oliviawilson@example.com',
      address: '321 Spruce St, Toronto, ON',
      emergencyContactPhone: '555-0123',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '118/78 mmHg',
          dateTime: '2024-10-10 09:00',
        },
        {
          type: 'Respiratory Rate',
          value: '18/min',
          dateTime: '2024-10-10 09:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '98%',
          dateTime: '2024-10-10 09:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '72/min',
          dateTime: '2024-10-10 09:00',
        },
      ],
    },
    {
      id: 7,
      name: 'Liam Thompson',
      age: 62,
      gender: 'Male',
      admissionDate: '2024-09-30',
      condition: 'Critical',
      phone: '555-7890',
      email: 'liamthompson@example.com',
      address: '654 Willow St, Toronto, ON',
      emergencyContactPhone: '555-1234',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '90/55 mmHg',
          dateTime: '2024-10-10 10:00',
        },
        {
          type: 'Respiratory Rate',
          value: '24/min',
          dateTime: '2024-10-10 10:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '82%',
          dateTime: '2024-10-10 10:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '115/min',
          dateTime: '2024-10-10 10:00',
        },
      ],
    },
    {
      id: 8,
      name: 'Sophia Martinez',
      age: 53,
      gender: 'Female',
      admissionDate: '2024-08-25',
      condition: 'Stable',
      phone: '555-8901',
      email: 'sophiamartinez@example.com',
      address: '987 Poplar St, Toronto, ON',
      emergencyContactPhone: '555-2345',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '125/80 mmHg',
          dateTime: '2024-10-10 11:00',
        },
        {
          type: 'Respiratory Rate',
          value: '17/min',
          dateTime: '2024-10-10 11:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '96%',
          dateTime: '2024-10-10 11:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '70/min',
          dateTime: '2024-10-10 11:00',
        },
      ],
    },
    {
      id: 9,
      name: 'James Taylor',
      age: 70,
      gender: 'Male',
      admissionDate: '2024-09-10',
      condition: 'Critical',
      phone: '555-9012',
      email: 'jamestaylor@example.com',
      address: '111 Chestnut St, Toronto, ON',
      emergencyContactPhone: '555-3456',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '85/50 mmHg',
          dateTime: '2024-10-10 12:00',
        },
        {
          type: 'Respiratory Rate',
          value: '22/min',
          dateTime: '2024-10-10 12:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '80%',
          dateTime: '2024-10-10 12:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '120/min',
          dateTime: '2024-10-10 12:00',
        },
      ],
    },
    {
      id: 10,
      name: 'Isabella Lee',
      age: 58,
      gender: 'Female',
      admissionDate: '2024-09-22',
      condition: 'Stable',
      phone: '555-0123',
      email: 'isabellalee@example.com',
      address: '222 Elm St, Toronto, ON',
      emergencyContactPhone: '555-4567',
      clinicalData: [
        {
          type: 'Blood Pressure',
          value: '115/75 mmHg',
          dateTime: '2024-10-10 13:00',
        },
        {
          type: 'Respiratory Rate',
          value: '16/min',
          dateTime: '2024-10-10 13:00',
        },
        {
          type: 'Blood Oxygen Level',
          value: '97%',
          dateTime: '2024-10-10 13:00',
        },
        {
          type: 'Heartbeat Rate',
          value: '68/min',
          dateTime: '2024-10-10 13:00',
        },
      ],
    },
  ]);
  const [list,setList] = useState(originalList);

  // TODO: Fetch Patients
  useEffect(() => {
    // Show the sorted patient list when load this page
    setList(sortPatientsByCondition([...originalList])); 
  }, []);

  const filterPatients = (nameToSearch) => {
    if (nameToSearch == '') {
      // TODO: Fetch Patients

      // If the search term is empty, reset it as the initial patient list and sort it
      setList(sortPatientsByCondition([...originalList]));
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
      setList(sortPatientsByCondition(resultList));
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
      <Text style={styles.id}>ID: {item.id}</Text>
        <Text style={styles.name}>{item.name}</Text>

        {/* Edit Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Patient Detail', { patient: item })}
        >
          <Icon name="edit" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Add Patient Icon */}
        <View style={styles.addPatientContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Add Patient')}>
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
            data={list}
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
