import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Screens/LoginPage';
import PatientListPage from './Screens/PatientListPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}  />
        <Stack.Screen name="Patient List" component={PatientListPage} />
        <Stack.Screen name="Add Patient" component={PatientListPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
