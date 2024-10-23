import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default function PatientDetailPage({ route, navigation }) {
  // Get the patient data passed from the patient list page
  const { patient } = route.params;
  const [clinicalData, setClinicalData] = useState(patient.clinicalData);

  const renderMeasurementItem = ({ item }) => (
    <View style={styles.measurementRow}>
      <Text style={styles.measurementCell}>{item.type}</Text>
      <Text style={styles.measurementCell}>{item.value}</Text>
      <Text style={styles.measurementCell}>{item.dateTime}</Text>
    </View>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();

    // getMonth() starts from 0 so it needs to +1
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    
    // Return YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  };

  const handleAddMeasurement = (newMeasurement) => {
    console.log("New Measurement added: ", newMeasurement)
    setClinicalData((prevData) => [newMeasurement, ...prevData]); // Update clinical data
  };

  return (
    <View style={styles.container}>
      {/* Top: Patient Profile */}
      <View style={styles.profileContainer}>
        {/* Use the temporary patient photo here, the image url will be stored in the DB */}
        <Image 
          source={require('../assets/patient-photo.jpg')}
          style={styles.photo}
        />

        {/* Display profile details */}
        <View style={styles.profileDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{patient.name}</Text>
            
            {/* Edit icon */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Patient Edit', { patient })}
              style={styles.editIconContainer}
            >
              <FontAwesomeIcon name="edit" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{patient.patientId}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{patient.age}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{patient.gender}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Admission Date:</Text>
              <Text style={styles.value}>{formatDate(patient.admissionDate)}</Text>
            </View>
          </View>
          <View style={styles.singleRow}>
            <Text style={styles.label}>Condition:</Text>
            <Text style={styles.value}>{patient.condition}</Text>
          </View>
        </View>
      </View>

      {/* Display contact details */}
      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Contact Details:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{patient.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{patient.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{patient.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Emergency Contact:</Text>
          <Text style={styles.value}>{patient.emergencyContactPhone}</Text>
        </View>
      </View>

      {/* Display History Measurement */}
      <View style={styles.measurementContainer}>
        <View style={styles.measurementHeaderContainer}>
          <Text style={styles.measurementTitle}>Recent Measurements</Text>
          {/* Add icon button */}
          <TouchableOpacity 
          onPress={() => navigation.navigate('Add Measurement', {addMeasurement: handleAddMeasurement})}>
              <Icon name="add-circle-outline" size={30} color="#007BFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.measurementHeader}>
          <Text style={styles.measurementHeaderCell}>Type</Text>
          <Text style={styles.measurementHeaderCell}>Value</Text>
          <Text style={styles.measurementHeaderCell}>Date/Time</Text>
        </View>
        <FlatList
          data={clinicalData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMeasurementItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  item: {
    flex: 1,
  },
  singleRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
  contactContainer: {
    marginTop: 0,
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  measurementContainer: {
    flex: 2,
  },
  measurementHeaderContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  measurementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  measurementHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  measurementCell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIconContainer: {
    marginLeft: 10,
  },
});
