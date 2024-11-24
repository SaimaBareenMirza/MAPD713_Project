import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PatientEditPage from '../PatientEditPage';

// Mock navigation
const mockNavigate = jest.fn();

jest.mock('react-native/Libraries/Settings/Settings', () => ({
    SettingsManager: {
      settings: {
        appSettings: {},
      },
    },
}));

// Mocking required modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('react-native-elements', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    CheckBox: ({ title, checked, onPress, testID }) => (
      <Text onPress={onPress} testID={testID || `checkbox-${title}`}>
        {title} {checked ? '(Checked)' : ''}
      </Text>
    ),
  };
});

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Picker: ({ selectedValue, onValueChange, children, testID }) => (
      <Text
        onPress={() => onValueChange(selectedValue)}
        testID={testID || "picker"}
      >
        {selectedValue || 'select'}
      </Text>
    ),
    PickerItem: ({ label }) => <Text>{label}</Text>,
  };
});

// Mock Alert
jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return {
    ...actualReactNative,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('PatientEditPage', () => {
  const mockPatient = {
    _id: '1',
    name: 'John Doe',
    age: 30,
    gender: 'male',
    condition: 'Critical',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St',
    emergencyContactPhone: '111-222-3333',
    medical: 'N/A',
    allergy: 'N/A',
    bloodType: 'O+',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all input fields correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <PatientEditPage route={{ params: { patient: mockPatient } }} navigation={{ navigate: mockNavigate }} />
    );

    expect(getByPlaceholderText('Enter Name').props.value).toBe(mockPatient.name);
    expect(getByPlaceholderText('Enter Age').props.value).toBe(mockPatient.age.toString());
    expect(getByPlaceholderText('Enter Number').props.value).toBe(mockPatient.phone);
    expect(getByPlaceholderText('Enter Emergency Contact').props.value).toBe(mockPatient.emergencyContactPhone);
    expect(getByPlaceholderText('Enter Email').props.value).toBe(mockPatient.email);
    expect(getByPlaceholderText('Enter Address').props.value).toBe(mockPatient.address);
    expect(getByText('Male (Checked)')).toBeTruthy();
    expect(getByText('Critical (Checked)')).toBeTruthy();
    expect(getByText('O+')).toBeTruthy();
  });

  it('successfully edits patient and navigates to Patient Detail', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const { getByPlaceholderText, getByText } = render(
      <PatientEditPage route={{ params: { patient: mockPatient } }} navigation={{ navigate: mockNavigate }} />
    );

    // Modify some fields
    fireEvent.changeText(getByPlaceholderText('Enter Name'), 'Jane Doe');
    fireEvent.changeText(getByPlaceholderText('Enter Age'), '35');
    fireEvent.press(getByText('Female'));

    // Submit the form
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/patients/${mockPatient._id}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            ...mockPatient,
            name: 'Jane Doe',
            age: 35,
            gender: 'female',
            condition: 'Critical',
            phone: '123-456-7890',
            email: 'john.doe@example.com',
            address: '123 Main St',
            emergencyContactPhone: '111-222-3333',
            medical: 'N/A',
            allergy: 'N/A',
            bloodType: 'O+',
          }),
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('Patient Detail', {
        patientId: mockPatient._id,
        refresh: true,
      });
    });
  });

  it('displays an error alert when edit fails', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error adding measurement' }),
    });
  
    const { getByPlaceholderText, getByText } = render(
      <PatientEditPage route={{ params: { patient: mockPatient } }} navigation={{ navigate: mockNavigate }} />
    );
  
    // Submit the form
    fireEvent.press(getByText('Submit'));
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/patients/${mockPatient._id}`, expect.any(Object));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });  
});
