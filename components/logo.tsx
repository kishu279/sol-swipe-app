import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const LogoIcon = () => {
  return (
    <View style={styles.container}>
      {/* Reference the local image file using 'require' */}
      <Image
        source={require('../ui-reference/logo.png')}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Optional: add padding or margin if needed
  },
  icon: {
    width: 30, // Set the desired width for your icon
    height: 30, // Set the desired height for your icon
    resizeMode: 'contain', // Ensures the whole logo is visible within the dimensions
  },
});

export default LogoIcon;
