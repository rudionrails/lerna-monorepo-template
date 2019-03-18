import React from "react";
import PropTypes from "prop-types";

const Hours = ({ hours, minutes }) => (
  <div className="font-weight-bold">
    {minutes === 0 ? hours : `${hours} hours`}
  </div>
);

Hours.propTypes = {
  hours: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
};

export default Hours;
