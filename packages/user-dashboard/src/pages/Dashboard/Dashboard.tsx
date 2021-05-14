import React, { useEffect } from "react";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Dasboard: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const { setCoreProxy } = useStoreContext();

  useEffect(() => {}, []);

  return <div>Dasboard</div>;
};

export default Dasboard;
