import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import Label from '../Label/Label';
import Ranking from '../Ranking/Ranking';
import NameInput from '../NameInput/NameInput';
import Save from '../Save/Save';

const Home = () => {
  const [showRanking, setShowRanking] = useState(false);
  const [username, setUsername] = useState('');
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRanking = localStorage.getItem('ranking');
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
      setShowRanking(true);
    }
  }, []);

  useEffect(() => {
    const button = document.querySelector('#h2-save');
    button.addEventListener('click', () => {
      setShowRanking(false);
    });
  }, []);

  const handleSave = () => {
    if (username) {
      const existingPlayer = ranking.find((player) => player.name === username);
      if (existingPlayer) {
        alert(`Bem-vindo de volta, ${username}!`);
      }
      navigate('/game', { state: { playerName: username } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username) {
      handleSave();
    }
  };

  return (
    <div className="App">
      <div id="tela-preta">
        <Label content={'registre seu nome'} />
        <NameInput
          name={username}
          setName={setUsername}
          onKeyPress={handleKeyPress}
        />
        <Save name={username} onSave={handleSave} label="Salvar" />
      </div>
      <div id="tela-rosa"></div>
      {showRanking && (
        <div id="rank">
          <Ranking ranking={ranking} />
        </div>
      )}
    </div>
  );
};

export default Home;
