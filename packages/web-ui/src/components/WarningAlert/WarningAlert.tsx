import React from "react";
import { Box } from "@material-ui/core";

interface IWarningAlert {
  errorMessage?: string;
}

export const WarningAlert: React.FC<IWarningAlert> = (props: IWarningAlert) => {
  const { errorMessage } = props;

  const defaultWarningMessage: string =
    "Someting went wrong during hypernet protocol initialization, Please try again or contact us for support";

  return (
    <Box display="flex" justifyContent="center" margin={4}>
      {errorMessage || defaultWarningMessage}
    </Box>
  );
};
