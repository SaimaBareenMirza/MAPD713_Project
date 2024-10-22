import * as React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default function LoginPage({ navigation }) {
  // Set remember me as false
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    // Authentication
    fetch('http://10.0.0.60:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Login successful") {
        navigation.navigate('Patient List');
      } else {
        Alert.alert("Error", data.message);
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      Alert.alert("Error", "An error occurred during login");
    });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.titleText}>Welcome</Text>
        <Text style={styles.text}>Sign into your Account</Text>
        <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
        
        {/* Remember Me and Forgot Password */}
        <View style={styles.rememberForgotContainer}>
          <CheckBox
            title="Remember Me"
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            containerStyle={styles.checkboxContainer}
          />
          <TouchableOpacity onPress={() => alert('Forgot Password Pressed')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        
        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  formContainer: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 30,
    alignItems: 'center',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 25,
    alignItems: 'center',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  forgotPasswordText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
