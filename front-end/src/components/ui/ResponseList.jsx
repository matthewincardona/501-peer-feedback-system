import PropTypes from 'prop-types';
import './ResponseList.css';

const ResponseList = ({ responses }) => {
  return (
    <div className="responseListCard">
      <table className="responseTable">
        <thead>
          <tr>
            <th className="tableHeader">Name</th>
            <th className="tableHeader">Status</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index} className="responseRow">
              <td className="nameCell">{response.name}</td>
              <td
                className={`statusCell ${
                  response.response === 1 ? 'responded' : 'notResponded'
                }`}
              >
                {response.response === 1 ? 'Responded' : 'Not Responded'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Define prop types for validation
ResponseList.propTypes = {
  responses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      response: PropTypes.number.isRequired, // Expecting response to be 0 or 1
    })
  ).isRequired,
};

export default ResponseList;
