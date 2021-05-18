import React, { useEffect } from "react";
import { useLayoutContext } from "@user-dashboard/contexts";

const SendAndReceive: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();

  useEffect(() => {}, []);

  return <div>SendAndReceive</div>;
};

export default SendAndReceive;
