import React from "react";

import useStyles from "./ModalFooter.style";

const ModalFooter: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.account}>
        <a
          className={classes.accountLink}
          href="https://hypernetlabs.io/"
          target="_blank"
        >
          View your Hypernet account.
        </a>
      </div>
    </div>
  );
};

export default ModalFooter;
