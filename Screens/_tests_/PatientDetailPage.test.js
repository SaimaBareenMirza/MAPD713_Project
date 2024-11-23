import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PatientDetailPage from '../PatientDetailPage';

// Mock navigation and route params
const mockNavigate = jest.fn();
const mockRoute = {
    params: {
        patientId: '123456',
        refresh: jest.fn(),
    },
};

describe('PatientDetailPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('render patient data correctly', async () => {
        // Mock patient data
        const mockPatient = {
            _id: '123456',
            patientId: 'PA001',
            name: 'John Doe',
            age: 35,
            gender: 'Male',
            admissionDate: '2023-01-01T00:00:00Z',
            condition: 'Stable',
            phone: '123-456-7890',
            email: 'johndoe@example.com',
            address: '941 Progress Ave',
            emergencyContactPhone: '111-222-3333',
        };

        // Mock clinical data
        const mockClinicalData = [
            { type: 'Blood Pressure', value: '120/80', dateTime: '2023-02-01T10:00:00Z' },
            { type: 'Heart Rate', value: '75 bpm', dateTime: '2023-02-02T12:00:00Z' },
        ];

        // Mock fetch responses
        fetch
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ patient: mockPatient }),
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => mockClinicalData,
        });

        const { findByText, getByText } = render(
            <PatientDetailPage route={mockRoute} navigation={{ navigate: mockNavigate }} />
        );

        // Check patient data
        await findByText('John Doe');
        expect(getByText('ID:')).toBeTruthy();
        expect(getByText('PA001')).toBeTruthy();
        expect(getByText('Age:')).toBeTruthy();
        expect(getByText('35')).toBeTruthy();
        expect(getByText('Gender:')).toBeTruthy();
        expect(getByText('Male')).toBeTruthy();
        expect(getByText('Condition:')).toBeTruthy();
        expect(getByText('Stable')).toBeTruthy();

        // Check clinical data
        expect(getByText('Blood Pressure')).toBeTruthy();
        expect(getByText('120/80')).toBeTruthy();
        expect(getByText('Heart Rate')).toBeTruthy();
        expect(getByText('75 bpm')).toBeTruthy();
    });

    it('navigate to Add Measurement page when clicking Add button', async () => {
        const mockPatient = { _id: '123456', patientId: 'PA001', name: 'John Doe' };
        const mockClinicalData = [];

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ patient: mockPatient }) })
            .mockResolvedValueOnce({ ok: true, json: async () => mockClinicalData });

        const { findByTestId } = render(<PatientDetailPage route={mockRoute} navigation={{ navigate: mockNavigate }} />);

        const addButton = await findByTestId('add-measurement');
        fireEvent.press(addButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Add Measurement', { patientId: '123456' });
        });
    });

    it('navigate to Edit Patient page when clicking Edit button', async () => {
        // Mock patient data
        const mockPatient = { _id: '123456', patientId: 'PA001', name: 'John Doe', age: 35, gender: 'Male' };
        const mockClinicalData = [];

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ patient: mockPatient }) })
            .mockResolvedValueOnce({ ok: true, json: async () => mockClinicalData });

        const { findByTestId } = render(<PatientDetailPage route={mockRoute} navigation={{ navigate: mockNavigate }} />);
        const editButton = await findByTestId('edit-patient');
        fireEvent.press(editButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Patient Edit', { patient: mockPatient });
        });
    });
});
