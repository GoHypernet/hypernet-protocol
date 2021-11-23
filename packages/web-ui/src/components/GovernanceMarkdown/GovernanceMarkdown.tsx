import React from "react";
import ReactMarkdown from "react-markdown";

export const GovernanceMarkdown: React.FC<ReactMarkdown.ReactMarkdownProps> = (
  props: ReactMarkdown.ReactMarkdownProps,
) => {
  return <ReactMarkdown {...props} />;
};
