import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddPatientPage from '../AddPatientPage';

// Mock navigation
const mockNavigate = jest.fn();

// react-native needs SettingManager modeule
// It would show "Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'SettingsManager' could not be found...." without this mock
jest.mock('react-native/Libraries/Settings/Settings', () => ({
    SettingsManager: {
      settings: {
        appSettings: {},
      },
    },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock Checkbox
jest.mock("react-native-elements", () => {
    const { Text } = jest.requireActual("react-native");
    return {
      CheckBox: ({ title }) => <Text>{title}</Text>,
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

// Mock Picker
jest.mock('@react-native-picker/picker', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        Picker: ({ selectedValue, onValueChange, children }) => (
            <Text
                onPress={() => onValueChange(selectedValue || 'O+')}
                testID="picker"
            >
                {selectedValue || 'O+'}
            </Text>
        ),
        PickerItem: ({ label, value }) => (
            <Text testID={`picker-item-${value}`}>{label}</Text>
        ),
    };
});

describe('AddPatientPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Check if all input fields and labels are rendered
    it('render all input fields correctly', () => {
        const { getByPlaceholderText, getByText } = render(
            <AddPatientPage navigation={{ navigate: mockNavigate }} />
        );

        expect(getByPlaceholderText('Enter Name')).toBeTruthy();
        expect(getByPlaceholderText('Enter Age')).toBeTruthy();
        expect(getByPlaceholderText('Enter Number')).toBeTruthy();
        expect(getByPlaceholderText('Enter Emergency Contact')).toBeTruthy();
        expect(getByPlaceholderText('Enter Email')).toBeTruthy();
        expect(getByPlaceholderText('Enter Address')).toBeTruthy();
        expect(getByPlaceholderText('Enter Medical History')).toBeTruthy();
        expect(getByPlaceholderText('Enter Allergies')).toBeTruthy();
        expect(getByText('Full Name:')).toBeTruthy();
        expect(getByText('Age:')).toBeTruthy();
        expect(getByText('Gender:')).toBeTruthy();
        expect(getByText('Condition:')).toBeTruthy();
        expect(getByText('Phone Number:')).toBeTruthy();
        expect(getByText('Emergency Contact:')).toBeTruthy();
        expect(getByText('Email:')).toBeTruthy();
        expect(getByText('Address:')).toBeTruthy();
        expect(getByText('Medical History:')).toBeTruthy();
        expect(getByText('Allergies (if Any):')).toBeTruthy();
        expect(getByText('Blood Type:')).toBeTruthy();
    });

    it('add patient successfully and navigate back to Patient List', async () => {
        const mockNavigate = jest.fn();
        const mockPatient = {
            name: 'John Doe',
            age: '30',
            gender: 'male',
            condition: 'Critical',
            phone: '123-456-7890',
            email: 'john.doe@example.com',
            address: '123 Main St',
            emergencyContact: '111-222-3333',
            medical: 'N/A',
            allergy: 'N/A',
            bloodType: 'O+',
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Patient created successfully', patient: mockPatient }),
        });

        const { getByPlaceholderText, getByText, findByTestId } = render(
            <AddPatientPage navigation={{ navigate: mockNavigate }} />
        );

        // Fill in the form
        fireEvent.changeText(getByPlaceholderText('Enter Name'), mockPatient.name);
        fireEvent.changeText(getByPlaceholderText('Enter Age'), mockPatient.age);
        fireEvent.press(getByText('Male'));
        fireEvent.press(getByText('Critical'));
        fireEvent.changeText(getByPlaceholderText('Enter Number'), mockPatient.phone);
        fireEvent.changeText(getByPlaceholderText('Enter Emergency Contact'), mockPatient.emergencyContact);
        fireEvent.changeText(getByPlaceholderText('Enter Email'), mockPatient.email);
        fireEvent.changeText(getByPlaceholderText('Enter Address'), mockPatient.address);
        fireEvent.changeText(getByPlaceholderText('Enter Medical History'), mockPatient.medical);
        fireEvent.changeText(getByPlaceholderText('Enter Allergies'), mockPatient.allergy);

        // Simulate selecting blood type
        const picker = await findByTestId('picker');
        fireEvent.press(picker);

        // Submit the form
        const createButton = getByText('Create');
        fireEvent.press(createButton);

        // Verify navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Patient List', { newPatient: mockPatient });
        });
    });

    it('display an error message when form submission fails', async () => {
        const { getByPlaceholderText, getByText } = render(
            <AddPatientPage navigation={{ navigate: mockNavigate }} />
        );

        // Fill out the form
        fireEvent.changeText(getByPlaceholderText('Enter Name'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Enter Age'), '30');
        fireEvent.press(getByText('Male'));
        fireEvent.press(getByText('Critical'));
        fireEvent.changeText(getByPlaceholderText('Enter Number'), '123-456-7890');
        fireEvent.changeText(getByPlaceholderText('Enter Emergency Contact'), '111-222-3333');
        fireEvent.changeText(getByPlaceholderText('Enter Email'), 'john.doe@example.com');
        fireEvent.changeText(getByPlaceholderText('Enter Address'), '123 Main St');
        fireEvent.changeText(getByPlaceholderText('Enter Medical History'), 'None');
        fireEvent.changeText(getByPlaceholderText('Enter Allergies'), 'None');

        // Mock the API failure response
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Error creating patient' }),
        });

        // Press the Create button
        fireEvent.press(getByText('Create'));

        // Wait for the error message
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/patients', expect.any(Object));
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
