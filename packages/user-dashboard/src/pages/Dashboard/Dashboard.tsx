import React, { useEffect } from "react";

import { useLayoutContext } from "@user-dashboard/contexts";

const Dasboard: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();

  useEffect(() => {}, []);

  return <div>Dasboard</div>;
};

export default Dasboard;
