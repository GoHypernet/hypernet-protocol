import React, { useEffect } from "react";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const SendAndReceive: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const { setCoreProxy } = useStoreContext();

  useEffect(() => {}, []);

  return <div>SendAndReceive</div>;
};

export default SendAndReceive;
