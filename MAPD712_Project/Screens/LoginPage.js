import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function LoginPage() {
  return (
    <View style={styles.viewStyle}>
        <Image source="./assets/Logo.png"></Image>
    </View>
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
