import React from "react";
import { Box, Link } from "@material-ui/core";

import { useStyles } from "@web-integration/components/TimeoutGuide/TimeoutGuide.style";

export const TimeoutGuide: React.FC = () => {
  const classes = useStyles();

  const corsUrls: string[] = [
    "https://core-iframe-dev.hypernetlabs.io",
    "https://vector-iframe-dev.hypernetlabs.io",
    "https://vector-auth-dev.hypernetlabs.io",
    "https://vector-nats-dev.hypernetlabs.io",
    "https://eth-provider-dev.hypernetlabs.io",
    "https://validator-iframe-dev.hypernetlabs.io",
    "https://hyperpay-dev.hypernetlabs.io",
  ];

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.title}>
        You have to enable insecure content in your browser! <br /> In the
        search bar of your browser at the left of the URL, click on "site
        settings" and then change "insecure content" from "Block" to "Allow",
        get back and refresh the page
      </Box>

      <Box className={classes.title}>
        If that didn't work, try to open the following URLs in new tab one by
        one and click "advanced" and then click "proceed to the domain.com"
      </Box>

      <Box className={classes.linkWrapper}>
        {corsUrls.map((url, index) => (
          <Link key={index} href={url} target="_blank">
            {url}
          </Link>
        ))}
      </Box>
    </Box>
  );
};
