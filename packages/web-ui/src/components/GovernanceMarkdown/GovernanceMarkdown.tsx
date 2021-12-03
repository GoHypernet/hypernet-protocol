import React from "react";
import ReactMarkdown from "react-markdown";

import { useStyles } from "@web-ui/components/GovernanceMarkdown/GovernanceMarkdown.style";

export const GovernanceMarkdown: React.FC<ReactMarkdown.ReactMarkdownProps> = (
  props: ReactMarkdown.ReactMarkdownProps,
) => {
  const classes = useStyles();

  return <ReactMarkdown className={classes.wrapper} {...props} />;
};
