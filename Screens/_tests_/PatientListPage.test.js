import React from 'react';
import { render, fireEvent, waitFor, getByLabelText } from '@testing-library/react-native';
import PatientListPage from '../PatientListPage';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useRoute: () => ({ params: {} }),
    useNavigation: () => ({ navigate: mockNavigate }),
    useFocusEffect: jest.fn(),
}));

// Mock SearchBar component
jest.mock('../../Components/SearchBar.js', () => {
    const React = require('react');
    const { TextInput } = require('react-native');
    return ({ term, onTermChange }) => (
        <TextInput
            testID="search-bar"
            value={term}
            onChangeText={onTermChange}
        />
    );
});

describe('PatientListPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('render patients correctly', async () => {
        const mockPatients = [
            { _id: '1', patientId: 'PA001', name: 'John Doe', condition: 'Stable' },
            { _id: '2', patientId: 'PA002', name: 'Jane Doe', condition: 'Critical' },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPatients,
        });

        const { getByText, findByText } = render(
            <PatientListPage navigation={{ navigate: mockNavigate }} />
        );

        // Verify patients are displayed
        await findByText('PA002');
        expect(getByText('Jane Doe')).toBeTruthy();
        expect(getByText('John Doe')).toBeTruthy();
    });

    it('sort patients by condition', async () => {
        const mockPatients = [
            { _id: '1', patientId: 'PA001', name: 'John Doe', condition: 'Stable' },
            { _id: '2', patientId: 'PA002', name: 'Jane Doe', condition: 'Critical' },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPatients,
        });

        const { findAllByText } = render(
            <PatientListPage navigation={{ navigate: mockNavigate }} />
        );

         // Match all patient IDs
        const rows = await findAllByText(/PA00/);

        // PA002 should be the first row because the condition is Critical
        expect(rows[0].props.children).toContain('PA002');
        expect(rows[1].props.children).toContain('PA001');
    });

    it('filter patients by name', async () => {
        const mockPatients = [
            { _id: '1', patientId: 'PA001', name: 'John Doe', condition: 'Stable' },
            { _id: '2', patientId: 'PA002', name: 'Jane Doe', condition: 'Critical' },
        ];
    
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPatients,
        });
    
        const { findByText, getByTestId, queryByText } = render(
            <PatientListPage navigation={{ navigate: mockNavigate }} />
        );

        await findByText('John Doe');
    
        const searchBar = getByTestId('search-bar');
    
        fireEvent.changeText(searchBar, 'Jane');

        await waitFor(() => {
            // Should not show John Doe
            expect(queryByText('John Doe')).toBeNull();
            expect(findByText('Jane Doe')).toBeTruthy();
        });
    });

    it('navigate to Add Patient page when clicking add button', async () => {
        const { findByTestId } = render(
            <PatientListPage navigation={{ navigate: mockNavigate }} />
        );

        const addButton = await findByTestId('person-add');
        fireEvent.press(addButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Add Patient');
        });
    });

    it('navigate to Patient Detail page when clicking detail button', async () => {
        const mockPatients = [
            { _id: '1', patientId: 'PA001', name: 'John Doe', condition: 'Stable' },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPatients,
        });

        const { findByTestId } = render(
            <PatientListPage navigation={{ navigate: mockNavigate }} />
        );

        const detailButton = await findByTestId('account-details');
        fireEvent.press(detailButton);

        expect(mockNavigate).toHaveBeenCalledWith('Patient Detail', { patientId: '1' });
    });
});
