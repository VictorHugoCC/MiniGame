import React from 'react';
import './styles.css';

const Save = ({ onSave, label }) => {
  const handleSave = () => {
    onSave();
  };

  return (
    <button id="h2-save" onClick={handleSave}>
      {label || 'Salvar'}
    </button>
  );
};

export default Save;
