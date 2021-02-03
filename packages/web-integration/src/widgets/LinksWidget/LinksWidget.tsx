import React from "react";
import { LinkList } from "@hypernetlabs/web-ui";
import { useLinks } from "@web-integration/hooks";

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
