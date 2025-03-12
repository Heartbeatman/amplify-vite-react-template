import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(outputs);

// Custom theme for Authenticator
const theme = {
  name: 'patient-portal-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#f0f9ff',
          20: '#e0f2fe',
          40: '#bae6fd',
          60: '#7dd3fc',
          80: '#38bdf8',
          90: '#0ea5e9',
          100: '#0284c7',
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        container: {
          widthMax: '600px',
        },
        form: {
          padding: '1.5rem',
        },
      },
    },
  },
};

// Custom Sign Up Form fields
const formFields = {
  signUp: {
    given_name: {
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      order: 1,
    },
    family_name: {
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: true,
      order: 2,
    },
    birthdate: {
      label: 'Date of Birth',
      placeholder: 'YYYY-MM-DD',
      required: true,
      order: 3,
    },
    email: {
      label: 'Email',
      placeholder: 'Enter your email address',
      required: true,
      order: 4,
    },
    password: {
      label: 'Password',
      placeholder: 'Create a password',
      required: true,
      order: 5,
    },
    confirm_password: {
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      required: true,
      order: 6,
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Authenticator formFields={formFields} signUpAttributes={['given_name', 'family_name', 'birthdate']}>
        <App />
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>
);