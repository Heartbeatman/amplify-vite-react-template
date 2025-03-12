import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import "./App.css";

const client = generateClient<Schema>();

// Sample questions
const questions = [
  { 
    id: "q1", 
    text: "On a scale of 1-10, how would you rate your pain today?",
    type: "range"
  },
  { 
    id: "q2", 
    text: "Have you taken your prescribed medication today?",
    type: "radio",
    options: ["Yes", "No"]
  },
  {
    id: "q3",
    text: "Which symptoms are you experiencing today? (Select all that apply)",
    type: "checkbox",
    options: ["Headache", "Fatigue", "Fever", "Nausea", "Muscle pain"]
  },
  {
    id: "q4",
    text: "Please describe how you're feeling today:",
    type: "textarea"
  }
];

function App() {
  const { user, signOut } = useAuthenticator();
  const [patientResponses, setPatientResponses] = useState<Array<Schema["PatientResponse"]["type"]>>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [checkboxResponses, setCheckboxResponses] = useState<Record<string, string[]>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    client.models.PatientResponse.observeQuery().subscribe({
      next: (data) => setPatientResponses([...data.items]),
    });
  }, []);

  function handleInputChange(questionId: string, value: string) {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  }

  function handleCheckboxChange(questionId: string, option: string, isChecked: boolean) {
    setCheckboxResponses(prev => {
      const currentSelections = prev[questionId] || [];
      if (isChecked) {
        return {
          ...prev,
          [questionId]: [...currentSelections, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentSelections.filter(item => item !== option)
        };
      }
    });
  }

  function saveResponse(questionId: string, questionText: string, type: string) {
    let responseValue = "";
    
    if (type === "checkbox" && checkboxResponses[questionId]) {
      if (checkboxResponses[questionId].length === 0) {
        setSubmitSuccess("Please select at least one option");
        setTimeout(() => setSubmitSuccess(null), 3000);
        return;
      }
      responseValue = checkboxResponses[questionId].join(", ");
    } else {
      responseValue = responses[questionId] || "";
      if (responseValue.trim() === "") {
        setSubmitSuccess("Please provide a response");
        setTimeout(() => setSubmitSuccess(null), 3000);
        return;
      }
    }
    
    client.models.PatientResponse.create({
      questionId,
      questionText,
      response: responseValue
    });
    
    // Clear just the submitted question's response
    setResponses(prev => ({
      ...prev,
      [questionId]: ""
    }));
    
    if (type === "checkbox") {
      setCheckboxResponses(prev => ({
        ...prev,
        [questionId]: []
      }));
    }
    
    setSubmittedQuestions(prev => [...prev, questionId]);
    setSubmitSuccess("Response submitted successfully!");
    setTimeout(() => setSubmitSuccess(null), 3000);
    
    // Remove from submitted questions after 2 seconds to allow submitting again
    setTimeout(() => {
      setSubmittedQuestions(prev => prev.filter(id => id !== questionId));
    }, 2000);
  }
  
  function deleteResponse(id: string) {
    client.models.PatientResponse.delete({ id });
    setSubmitSuccess("Response deleted successfully!");
    setTimeout(() => setSubmitSuccess(null), 3000);
  }

  return (
    <main>
      <h1>Patient Questionnaire for {user?.signInDetails?.loginId}</h1>
      
      {submitSuccess && (
        <div className="success-message">
          <span className="success-icon">✓</span> {submitSuccess}
        </div>
      )}
      
      <div className="questionnaire">
        <h2>Please answer the following questions:</h2>
        
        {questions.map((question) => (
          <div key={question.id} className="question-container">
            <h3>{question.text}</h3>
            
            {question.type === "range" && (
              <div className="range-slider">
                <div className="slider-container">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={responses[question.id] || "5"}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                  <span>{responses[question.id] || "5"}</span>
                </div>
                <div className="range-labels">
                  <span>1 (No Pain)</span>
                  <span>10 (Severe Pain)</span>
                </div>
              </div>
            )}
            
            {question.type === "radio" && question.options && (
              <div className="radio-group">
                {question.options.map((option) => (
                  <label key={option} className="radio-option">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={responses[question.id] === option}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            
            {question.type === "checkbox" && question.options && (
              <div className="radio-group">
                {question.options.map((option) => (
                  <label key={option} className="radio-option">
                    <input
                      type="checkbox"
                      value={option}
                      checked={(checkboxResponses[question.id] || []).includes(option)}
                      onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            
            {question.type === "textarea" && (
              <textarea
                value={responses[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder="Enter your response"
                rows={4}
                style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #eee" }}
              />
            )}
            
            <button 
              onClick={() => saveResponse(question.id, question.text, question.type)}
              disabled={submittedQuestions.includes(question.id)}
            >
              {submittedQuestions.includes(question.id) ? "Submitted" : "Submit Response"}
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
                <div className="response-content">
                  <div className="question-metadata">Question:</div>
                  <strong>{response.questionText}</strong>
                  <div className="question-metadata">Your Answer:</div>
                  <div>{response.response}</div>
                </div>
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
