import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import "./App.css";

const client = generateClient<Schema>();

// Sample questions
const questions = [
  { id: "q1", text: "On a scale of 1-10, how would you rate your pain today?" },
  { id: "q2", text: "Have you taken your prescribed medication today? (Yes/No)" }
];

function App() {
  const { user, signOut } = useAuthenticator();
  const [patientResponses, setPatientResponses] = useState<Array<Schema["PatientResponse"]["type"]>>([]);
  const [currentResponse, setCurrentResponse] = useState("");

  useEffect(() => {
    client.models.PatientResponse.observeQuery().subscribe({
      next: (data) => setPatientResponses([...data.items]),
    });
  }, []);

  function saveResponse(questionId: string, questionText: string) {
    if (currentResponse.trim() === "") {
      alert("Please provide a response");
      return;
    }
    
    client.models.PatientResponse.create({
      questionId,
      questionText,
      response: currentResponse
    });
    
    setCurrentResponse("");
  }
  
  function deleteResponse(id: string) {
    client.models.PatientResponse.delete({ id });
  }

  return (
    <main>
      <h1>Patient Questionnaire for {user?.signInDetails?.loginId}</h1>
      
      <div className="questionnaire">
        <h2>Please answer the following questions:</h2>
        
        {questions.map((question) => (
          <div key={question.id} className="question-container">
            <h3>{question.text}</h3>
            <input
              type="text"
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Enter your response"
            />
            <button onClick={() => saveResponse(question.id, question.text)}>
              Submit Response
            </button>
          </div>
        ))}
      </div>
      
      <div className="responses">
        <h2>Your Previous Responses:</h2>
        {patientResponses.length === 0 ? (
          <p>No responses submitted yet.</p>
        ) : (
          <ul>
            {patientResponses.map((response) => (
              <li key={response.id}>
                <strong>{response.questionText}</strong>: {response.response}
                <button className="delete" onClick={() => deleteResponse(response.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <button className="sign-out" onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
