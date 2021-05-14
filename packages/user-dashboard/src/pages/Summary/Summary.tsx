import React, { useEffect } from "react";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Summary: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const { setCoreProxy } = useStoreContext();

  useEffect(() => {}, []);

  return <div>Summary</div>;
};

export default Summary;
