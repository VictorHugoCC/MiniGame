import React from 'react';
import './styles.css';

const NameInput = ({ name, setName, onKeyPress }) => {
  function hidePlaceholder(e) {
    e.target.placeholder = '';
  }

  const handleChange = (e) => {
    if (e.target.value.length <= 10) {
      setName(e.target.value);
    }
  };

  return (
    <input
      type="text"
      value={name}
      onChange={handleChange}
      placeholder="Victor Hugo"
      className="name-input"
      onFocus={(e) => hidePlaceholder(e)}
      onKeyPress={onKeyPress}
    />
  );
};

export default NameInput;
