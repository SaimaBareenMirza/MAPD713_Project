module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "node_modules/(?!(expo-image-picker|expo-modules-core|react-native|@react-native|react-native-elements|react-native-vector-icons|@react-native-vector-icons|@react-native-elements|@react-native-elements/themed)/)",
    ],
};
  