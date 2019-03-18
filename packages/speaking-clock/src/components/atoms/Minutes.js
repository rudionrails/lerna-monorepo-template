import React from "react";
import PropTypes from "prop-types";

const Minutes = ({ minutes }) => (
  <div className="font-weight-light text-muted">
    {minutes === 0 ? "o' clock" : `and ${minutes} minutes`}
  </div>
);

Minutes.propTypes = {
  minutes: PropTypes.number.isRequired,
};

export default Minutes;
