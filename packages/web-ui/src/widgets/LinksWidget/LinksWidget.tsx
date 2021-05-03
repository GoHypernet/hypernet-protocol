import React from "react";

import { LinkList } from "@web-ui/components";
import { useLinks } from "@web-ui/hooks";

const LinksWidget: React.FC = () => {
  const { links } = useLinks();
  console.log("linkssssssss: ", links);

  // put some logic if needed

  return (
    <div>
      <h2>here is your LinksWidget: </h2>
      <LinkList links={links} />
    </div>
  );
};

export default LinksWidget;
