import './styles.css';

const Ranking = ({ ranking }) => {
  const rankingToShow = ranking.sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <>
      <div id="label-ranking">
        Ranking
        <div id="ranking-content">
          {rankingToShow.map((r, index) => (
            <p key={index}>
              {index + 1}. {r.name} - {r.score} pontos
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Ranking;
