import "./ResponseLabel.css";

function ResponseLabel({ labelText, num1, num2 }) {
  // Accepts a "Icon" object
  return (
    <div className="responseLabel">
      {`${labelText} ${num1}/${num2}`}
    </div>
  );
}

export default ResponseLabel;
