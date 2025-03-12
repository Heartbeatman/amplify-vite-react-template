import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import PatientProfile from "./components/PatientProfile";
import PatientForm from "./components/PatientForm";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [patient, setPatient] = useState<Schema["Patient"]["type"] | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [formResponses, setFormResponses] = useState<Array<Schema["FormResponse"]["type"]>>([]);

  // Fetch patient profile on component mount
  useEffect(() => {
    async function fetchPatientProfile() {
      try {
        // Query for patient profile linked to the authenticated user
        const response = await client.models.Patient.list({
          // We'll use a filter to find the patient profile for the current user
          filter: {
            // This assumes the Patient model is set up with owner authorization
            // The system will automatically filter by the current user
          },
          limit: 1
        });

        if (response.items.length > 0) {
          setPatient(response.items[0]);
        } else {
          // No profile found, show profile creation form
          setShowProfileForm(true);
        }
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    }

    fetchPatientProfile();
  }, []);

  // Fetch form responses for the patient
  useEffect(() => {
    if (patient) {
      client.models.FormResponse.observeQuery({
        filter: {
          patientID: {
            eq: patient.id
          }
        },
        sort: {
          field: 'submittedAt',
          direction: 'DESC'
        }
      }).subscribe({
        next: (data) => setFormResponses([...data.items]),
      });
    }
  }, [patient]);

  // Create or update patient profile
  async function savePatientProfile(profileData: any) {
    try {
      if (patient) {
        // Update existing profile
        const updatedPatient = await client.models.Patient.update({
          id: patient.id,
          ...profileData
        });
        setPatient(updatedPatient);
      } else {
        // Create new profile
        const newPatient = await client.models.Patient.create(profileData);
        setPatient(newPatient);
      }
      setShowProfileForm(false);
    } catch (error) {
      console.error("Error saving patient profile:", error);
    }
  }

  // Submit a form response
  async function submitFormResponse(formType: string, responses: any) {
    if (!patient) return;

    try {
      const formResponse = await client.models.FormResponse.create({
        patientID: patient.id,
        formType,
        responses,
        submittedAt: new Date().toISOString()
      });

      setFormResponses([formResponse, ...formResponses]);
      setShowHealthForm(false);
    } catch (error) {
      console.error("Error submitting form response:", error);
    }
  }

  return (
    <main className="patient-portal">
      <header>
        <h1>Patient Portal</h1>
        <div className="user-info">
          <span>{user?.signInDetails?.loginId}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>

      {showProfileForm ? (
        <div className="profile-form-container">
          <h2>{patient ? 'Update Profile' : 'Complete Your Profile'}</h2>
          <PatientProfile 
            initialData={patient} 
            onSave={savePatientProfile} 
            onCancel={() => setShowProfileForm(false)}
          />
        </div>
      ) : showHealthForm ? (
        <div className="health-form-container">
          <h2>Health Questionnaire</h2>
          <PatientForm onSubmit={(responses) => submitFormResponse('healthQuestionnaire', responses)} />
        </div>
      ) : (
        <div className="patient-dashboard">
          {patient ? (
            <>
              <div className="patient-info">
                <h2>Welcome, {patient.firstName} {patient.lastName}</h2>
                <button onClick={() => setShowProfileForm(true)}>Edit Profile</button>
              </div>
              
              <div className="actions">
                <button className="primary-button" onClick={() => setShowHealthForm(true)}>
                  Complete Health Questionnaire
                </button>
              </div>

              {formResponses.length > 0 && (
                <div className="form-history">
                  <h3>Form Submission History</h3>
                  <ul>
                    {formResponses.map((response) => (
                      <li key={response.id}>
                        {response.formType} - Submitted on {new Date(response.submittedAt).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="loading">Loading patient profile...</div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;