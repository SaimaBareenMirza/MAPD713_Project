import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function LoginPage() {
  return (
    <Image source="./assets/Logo.png"></Image>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
