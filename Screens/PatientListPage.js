import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import SearchBar from "../Components/SearchBar";

export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [list,setList] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 65,
      gender: 'Male',
      admissionDate: '2024-10-01',
      condition: 'Stable',
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

  // TODO: Fetch Patients

  const filterPatients = (nameToSearch) => {
    if (nameToSearch == '') {
        // The search term is empty
        // TODO: Fetch Patients
        return list;
    } else {
        var resultList = list.filter((patient) => {
            return patient.name == nameToSearch
        })
        
        if (resultList.length > 0) {
            setList(resultList);
        }
    }
  }

  const renderItem = ({ item }) => (
    <View style={[styles.item, 
      item.condition === 'Critical' ? styles.criticalRow : styles.stableRow]}>
      <View style={styles.row}>
      <Text style={styles.id}>ID: {item.id}</Text>
        <Text style={styles.name}>{item.name}</Text>
        
        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('PatientDetail', { patient: item })}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <SearchBar term={searchTerm}
            onTermChange={(newTerm) => {
                setSearchTerm(newTerm)
                filterPatients(newTerm)
        }} />
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
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
  },
});
