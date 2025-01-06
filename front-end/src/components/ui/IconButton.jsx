import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './IconButton.css';

function IconButton({ icon, text, onClick }) {
  return (
    <button
      className="iconButton"
      onClick={onClick}
    >
      {text}
      {icon && <FontAwesomeIcon icon={icon} size="lg" />}
    </button>
  );
}

export default IconButton;


// Example Usage w/ Icon:
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

// <IconButton
//   icon={faPlus}
//   text="Add New"
// />

// Example Usage without Icon:
// <IconButton
//   icon=""
//   text="Add New"
// />