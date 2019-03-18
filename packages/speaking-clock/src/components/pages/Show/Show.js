import React from "react";
import PropTypes from "prop-types";

import Hours from "../../atoms/Hours";
import Minutes from "../../atoms/Minutes";

const Show = ({ date }) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (
    <div className="text-center">
      <div className="small text-muted">the time is</div>

      <Hours {...{ hours, minutes }} />
      <Minutes {...{ minutes }} />
    </div>
  );
};

Show.propTypes = {
  date: PropTypes.shape({
    getHours: PropTypes.func.isRequired,
    getMinutes: PropTypes.func.isRequired,
  }).isRequired,
};

export default Show;
