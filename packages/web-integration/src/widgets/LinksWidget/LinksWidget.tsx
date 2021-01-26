import React from "react";
import { useLinks } from "../../hooks";

const LinksWidget: React.FC = () => {
  const { links } = useLinks();
  console.log("linkssssssss: ", links);

  // put some logic if needed

  return (
    <div>
      <h2>here is your LinksWidget: </h2>
    </div>
  );
};

export default LinksWidget;
