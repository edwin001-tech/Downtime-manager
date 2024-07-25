// src/AddActionForm.js

import React, { useState } from 'react';
import './AddActionForm.css';

const AddActionForm = ({ onAdd, onCancel }) => {
  const [actionData, setActionData] = useState({
    action: '',
    person: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActionData({
      ...actionData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    onAdd(actionData);
  };

  return (
    <div className="add-action-form">
      <div>
        <label>
          What are we trying?
          <input
            type="text"
            name="action"
            value={actionData.action}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Who is doing it?
          <input
            type="text"
            name="person"
            value={actionData.person}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Any additional Information?
          <textarea
            name="additionalInfo"
            value={actionData.additionalInfo}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-buttons">
        <button type="button" onClick={handleSubmit}>Add</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AddActionForm;
