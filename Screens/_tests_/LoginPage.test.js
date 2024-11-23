import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../LoginPage';
import { Alert } from 'react-native';

// react-native needs SettingManager modeule
// It would show "Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'SettingsManager' could not be found...." without this mock
jest.mock('react-native/Libraries/Settings/Settings', () => ({
    SettingsManager: {
      settings: {
        appSettings: {},
      },
    },
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

// Mock navigation prop
const mockNavigate = jest.fn();

describe('LoginPage', () => {
    beforeEach(() => {
        // Reset mock function calls before each test
        mockNavigate.mockReset();

        // Mock the fetch API
        global.fetch = jest.fn();
    });
  
    afterEach(() => {
        // Clears the mock.calls, mock.instances, mock.contexts and mock.results properties of all mocks.
        jest.clearAllMocks();
    });

    // Check if renders all of components
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );

        // Check that all necessary elements are rendered
        expect(getByText('Welcome')).toBeTruthy();
        expect(getByText('Sign into your Account')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Login')).toBeTruthy();
        expect(getByText('Forgot password?')).toBeTruthy();
        expect(getByText('Remember Me')).toBeTruthy();
    });

    // The user must enter email and password
    it('shows an error when email or password is missing', () => {
        const { getByText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.press(getByText('Login'));

        // Expect to show an alert with 'Please enter both email and password'
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
    });

    it('shows an error if email is invalid', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ message: 'Invalid email' }),
        });
    
        const { getByText, getByPlaceholderText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );
    
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'admin123');
        fireEvent.press(getByText('Login'));
    
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid email');
        });
    });

    it('shows an error if password is invalid', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ message: 'Invalid password' }),
        });
    
        const { getByText, getByPlaceholderText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );
    
        fireEvent.changeText(getByPlaceholderText('Email'), 'admin@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
        fireEvent.press(getByText('Login'));
    
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid password');
        });
    });

    // Test if it can navigate to forgot password page
    it('Navigate to Forgot Password page when click the link', () => {
        const { getByText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.press(getByText('Forgot password?'));

        // Check that navigation to 'Forgot Password' is called
        expect(mockNavigate).toHaveBeenCalledWith('Forgot Password');
    });

    it('Login and navigate to Patient List page', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                message: 'Login successful',
                user: { email: 'admin@example.com', role: 'admin' },
            }),
        });
      
        const { getByText, getByPlaceholderText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );
      
        fireEvent.changeText(getByPlaceholderText('Email'), 'admin@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'admin123');
        fireEvent.press(getByText('Login'));
      
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@example.com',
                    password: 'admin123',
                }),
            });
      
            expect(Alert.alert).not.toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('Patient List');
        });
    });

    it('shows an error if there is a network error', async () => {
        // Mock a network error
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const { getByText, getByPlaceholderText } = render(
            <LoginPage navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'admin@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'admin123');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'An error occurred during login');
        });
    });
});
