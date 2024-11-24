import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddMeasurementPage from '../AddMeasurementPage';

// Mock navigation
const mockNavigate = jest.fn();

// Mock route params
const mockRoute = {
    params: { patientId: '12345' },
};

// Mock fetch
global.fetch = jest.fn();

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
    const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
    return ({ value, onChange, mode }) => (
        <TouchableOpacity onPress={() => onChange(null, new Date('2024-01-01T12:00:00'))}>
            <Text testID={`datetimepicker-${mode}`}>{value.toString()}</Text>
        </TouchableOpacity>
    );
});

// Mock Picker
jest.mock('@react-native-picker/picker', () => {
    const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
    const MockPicker = ({ selectedValue, onValueChange, children }) => (
        <View>
            <TouchableOpacity onPress={() => onValueChange('Blood Pressure')} testID="picker">
                <Text>{selectedValue || 'Select a Test'}</Text>
            </TouchableOpacity>
            {children}
        </View>
    );
    MockPicker.Item = ({ label }) => <Text>{label}</Text>;
    return { Picker: MockPicker };
});

// Test suite
describe('AddMeasurementPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Test: Renders the input fields and picker correctly
    it('renders the input fields and picker correctly', () => {
        const { getByText, getByTestId } = render(
            <AddMeasurementPage route={mockRoute} navigation={{ navigate: mockNavigate }} />
        );

        expect(getByText('Select Test:')).toBeTruthy();
        expect(getByTestId('picker')).toBeTruthy();
        expect(getByText('Test Time:')).toBeTruthy();
        expect(getByTestId('datetimepicker-date')).toBeTruthy();
        expect(getByTestId('datetimepicker-time')).toBeTruthy();
        expect(getByText('Submit Measurement')).toBeTruthy();
    });

    // Test: Displays appropriate input fields based on test selection
    it('displays appropriate input fields based on test selection', () => {
        const { getByTestId, getByPlaceholderText } = render(
            <AddMeasurementPage route={mockRoute} navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.press(getByTestId('picker')); // Simulate selecting "Blood Pressure"

        expect(getByPlaceholderText('Enter Sys Value')).toBeTruthy();
        expect(getByPlaceholderText('Enter Dia Value')).toBeTruthy();
    });

    // Test: Submits measurement data successfully and navigates back
    it('submits measurement data successfully and navigates back', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Measurement added successfully' }),
        });

        const { getByTestId, getByPlaceholderText, getByText } = render(
            <AddMeasurementPage route={mockRoute} navigation={{ navigate: mockNavigate }} />
        );

        // Simulate user input
        fireEvent.press(getByTestId('picker')); // Select "Blood Pressure"
        fireEvent.changeText(getByPlaceholderText('Enter Sys Value'), '120');
        fireEvent.changeText(getByPlaceholderText('Enter Dia Value'), '80');
        fireEvent.press(getByTestId('datetimepicker-date'));
        fireEvent.press(getByTestId('datetimepicker-time'));
        fireEvent.press(getByText('Submit Measurement'));

        // Check fetch was called correctly
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/clinical', expect.any(Object));
            expect(mockNavigate).toHaveBeenCalledWith('Patient Detail', {
                patientId: '12345',
                refresh: true,
        });
    });
});

    // Test: Displays an error when form submission fails
    it('displays an error when form submission fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Error adding measurement' }),
        });

        const { getByTestId, getByPlaceholderText, getByText } = render(
            <AddMeasurementPage route={mockRoute} navigation={{ navigate: mockNavigate }} />
        );

        // Simulate user input
        fireEvent.press(getByTestId('picker')); // Select "Blood Pressure"
        fireEvent.changeText(getByPlaceholderText('Enter Sys Value'), '120');
        fireEvent.changeText(getByPlaceholderText('Enter Dia Value'), '80');
        fireEvent.press(getByTestId('datetimepicker-date'));
        fireEvent.press(getByTestId('datetimepicker-time'));
        fireEvent.press(getByText('Submit Measurement'));

        // Check error alert
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/clinical', expect.any(Object));
            expect(mockNavigate).not.toHaveBeenCalled();
        });

       
    });
});
