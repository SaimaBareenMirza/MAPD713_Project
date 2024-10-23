import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Screens/LoginPage';
import PatientListPage from './Screens/PatientListPage';
import PatientDetailPage from './Screens/PatientDetailPage';
import AddPatientPage from './Screens/AddPatientPage';
import AddMeasurementPage from './Screens/AddMeasurementPage';
import PatientEditPage from './Screens/PatientEditPage';
import ForgotPasswordPage from './Screens/ForgotPasswordPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}  />
        <Stack.Screen name="Patient List" component={PatientListPage} />
        <Stack.Screen name="Patient Detail" component={PatientDetailPage} />
        <Stack.Screen name="Add Patient" component={AddPatientPage} />
        <Stack.Screen name="Add Measurement" component={AddMeasurementPage} />
        <Stack.Screen name="Patient Edit" component={PatientEditPage} />
        <Stack.Screen name="Forgot Password" component={ForgotPasswordPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
