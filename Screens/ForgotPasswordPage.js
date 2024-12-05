import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';

export default function ForgotPasswordPage({ navigation }) {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = React.useState('');

  const handleResetPassword = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and new password.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', data.message);

        // If reset the password successfully, navigate back to login page
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.instructions}>Enter your email address below to reset your password:</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry={true} 
        onChangeText={setPassword} 
      />

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'left',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backToLogin: {
    color: '#007BFF',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
