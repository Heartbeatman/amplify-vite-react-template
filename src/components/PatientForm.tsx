import React, { useState } from 'react';

interface PatientFormProps {
  onSubmit: (responses: any) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Sample question 1: Pain assessment
    painLevel: '',
    painLocation: '',
    painDuration: '',
    
    // Sample question 2: Medication history
    currentMedications: '',
    medicationAllergies: '',
    recentMedicationChanges: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="patient-health-form">
      {/* Question 1: Pain Assessment */}
      <div className="form-section">
        <h3>Pain Assessment</h3>
        
        <div className="form-group">
          <label htmlFor="painLevel">On a scale of 0-10, how would you rate your pain today?*</label>
          <select
            id="painLevel"
            name="painLevel"
            value={formData.painLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select pain level</option>
            <option value="0">0 - No pain</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5 - Moderate pain</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10 - Worst possible pain</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="painLocation">Where are you experiencing pain? (Check all that apply)</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="painLocation"
                value="head"
                checked={formData.painLocation.includes('head')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    painLocation: e.target.checked
                      ? prev.painLocation ? `${prev.painLocation},${value}` : value
                      : prev.painLocation.split(',').filter(loc => loc !== value).join(',')
                  }));
                }}
              />
              Head
            </label>
            <label>
              <input
                type="checkbox"
                name="painLocation"
                value="neck"
                checked={formData.painLocation.includes('neck')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    painLocation: e.target.checked
                      ? prev.painLocation ? `${prev.painLocation},${value}` : value
                      : prev.painLocation.split(',').filter(loc => loc !== value).join(',')
                  }));
                }}
              />
              Neck
            </label>
            <label>
              <input
                type="checkbox"
                name="painLocation"
                value="back"
                checked={formData.painLocation.includes('back')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    painLocation: e.target.checked
                      ? prev.painLocation ? `${prev.painLocation},${value}` : value
                      : prev.painLocation.split(',').filter(loc => loc !== value).join(',')
                  }));
                }}
              />
              Back
            </label>
            <label>
              <input
                type="checkbox"
                name="painLocation"
                value="chest"
                checked={formData.painLocation.includes('chest')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    painLocation: e.target.checked
                      ? prev.painLocation ? `${prev.painLocation},${value}` : value
                      : prev.painLocation.split(',').filter(loc => loc !== value).join(',')
                  }));
                }}
              />
              Chest
            </label>
            <label>
              <input
                type="checkbox"
                name="painLocation"
                value="abdomen"
                checked={formData.painLocation.includes('abdomen')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    painLocation: e.target.checked
                      ? prev.painLocation ? `${prev.painLocation},${value}` : value
                      : prev.painLocation.split(',').filter(loc => loc !== value).join(',')
                  }));
                }}
              />
              Abdomen
            </label>
            <label>
              <input
                type="checkbox"
                name="painLocation"
                value="limbs"
                checked={formData.painLocation.includes('limbs')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    painLocation: e.target.checked
                      ? prev.painLocation ? `${prev.painLocation},${value}` : value
                      : prev.painLocation.split(',').filter(loc => loc !== value).join(',')
                  }));
                }}
              />
              Arms/Legs
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="painDuration">How long have you been experiencing this pain?*</label>
          <select
            id="painDuration"
            name="painDuration"
            value={formData.painDuration}
            onChange={handleChange}
            required
          >
            <option value="">Select duration</option>
            <option value="less-than-day">Less than a day</option>
            <option value="1-3-days">1-3 days</option>
            <option value="4-7-days">4-7 days</option>
            <option value="1-2-weeks">1-2 weeks</option>
            <option value="2-4-weeks">2-4 weeks</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="more-than-6-months">More than 6 months</option>
          </select>
        </div>
      </div>
      
      {/* Question 2: Medication History */}
      <div className="form-section">
        <h3>Medication Information</h3>
        
        <div className="form-group">
          <label htmlFor="currentMedications">Please list all medications you are currently taking:</label>
          <textarea
            id="currentMedications"
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleChange}
            rows={4}
            placeholder="Include name, dosage, and frequency"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="medicationAllergies">Do you have any medication allergies? If yes, please list:</label>
          <textarea
            id="medicationAllergies"
            name="medicationAllergies"
            value={formData.medicationAllergies}
            onChange={handleChange}
            rows={2}
          />
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="recentMedicationChanges"
              checked={formData.recentMedicationChanges}
              onChange={handleChange}
            />
            Have you had any changes to your medication in the past 30 days?
          </label>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="primary-button">
          Submit Questionnaire
        </button>
      </div>
    </form>
  );
};

export default PatientForm;