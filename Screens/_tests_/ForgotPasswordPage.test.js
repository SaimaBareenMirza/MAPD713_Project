import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPasswordPage from '../ForgotPasswordPage';
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

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Check if renders all of components
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <ForgotPasswordPage navigation={{ navigate: mockNavigate }} />
        );

        // Check that all elements are rendered
        expect(getByText('Forgot Password')).toBeTruthy();
        expect(getByText('Enter your email address below to reset your password:')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
    });

    // The user must enter email and password
    it('shows an error if email or password is missing', () => {
        const { getByText } = render(
            <ForgotPasswordPage navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.press(getByText('Reset Password'));

        // Verify Alert is shown
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and new password.');
    });

    // Verify the email exists
    it('shows an error if email does not exist', async () => {
        // Mock a response when the email is not found
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Email does not exist.' }),
        });
    
        const { getByText, getByPlaceholderText } = render(
          <ForgotPasswordPage navigation={{ navigate: mockNavigate }} />
        );
    
        fireEvent.changeText(getByPlaceholderText('Email'), 'aaa@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'newpassword123');
        fireEvent.press(getByText('Reset Password'));
    
        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email does not exist.');
        });
    });

    it('Navigate to Login page if reset password successfully', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Password reset successfully.' }),
        });

        const { getByText, getByPlaceholderText } = render(
            <ForgotPasswordPage navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'admin@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'newAdmin123');
        fireEvent.press(getByText('Reset Password'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@example.com', newPassword: 'newAdmin123' }),
            });

            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Password reset successfully.');
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
    });

    it('shows a network error if fetch fails', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const { getByText, getByPlaceholderText } = render(
            <ForgotPasswordPage navigation={{ navigate: mockNavigate }} />
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'admin@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'admin123');
        fireEvent.press(getByText('Reset Password'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'An error occurred. Please try again later.');
        });
    });
});
