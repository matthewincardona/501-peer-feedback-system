import "./ResponseCard.css";

function ResponseCard({ respData }) {
  // Check if respData contains a structured "result" array with "QuestionList"
  const questionList = respData?.result?.[0]?.QuestionList;
  const answers = respData || {};

  return (
    <div className="responseCard__grid">
      {questionList ? (
        // Display based on QuestionList if it exists
        questionList.map((question, index) => (
          <div key={index} className="responseCard__section">
            <p className="responseCard__header">{question.text}</p>
            <p className="responseCard__text">
              {answers[question.text] || "No answer available"}
            </p>
          </div>
        ))
      ) : (
        // Display directly from answers if QuestionList is not present
        Object.entries(answers).map(([header, answer], index) => (
          <div key={index} className="responseCard__section">
            <p className="responseCard__header">{header}</p>
            <p className="responseCard__text">{answer || "No answer available"}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ResponseCard;
