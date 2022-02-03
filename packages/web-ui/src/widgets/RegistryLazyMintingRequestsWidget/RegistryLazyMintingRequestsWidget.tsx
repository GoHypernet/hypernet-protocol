import { LazyMintingSignature } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import React, { useEffect, useState } from "react";

import {
  GovernanceRegistryListItem,
  IRegistryListItemAction,
  GovernanceWidgetHeader,
  GovernanceEmptyState,
} from "@web-ui/components";
import { IRenderParams } from "@web-ui/interfaces";

interface IRegistryLazyMintingRequestsWidgetParams extends IRenderParams {}

const RegistryLazyMintingRequestsWidget: React.FC<IRegistryLazyMintingRequestsWidgetParams> =
  () => {
    const { coreProxy } = useStoreContext();
    const { setLoading, handleCoreError } = useLayoutContext();
    const [lazyMintingSignatures, setLazyMintingSignatures] = useState<
      LazyMintingSignature[]
    >([]);
    const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

    useEffect(() => {
      getLazyMintSignatures();
    }, []);

    const getLazyMintSignatures = () => {
      setLoading(true);
      coreProxy.registries
        .retrieveLazyMintingSignatures()
        .map((lazyMintingSignatureList) => {
          setLazyMintingSignatures(lazyMintingSignatureList || []);
          if (
            !lazyMintingSignatureList ||
            lazyMintingSignatureList.length === 0
          ) {
            setHasEmptyState(true);
          }
          setLoading(false);
        })
        .mapErr(handleCoreError);
    };

    const revokeSignature = (lazyMintingSignature: LazyMintingSignature) => {
      setLoading(true);
      coreProxy.registries
        .revokeLazyMintSignature(lazyMintingSignature)
        .map(() => {
          getLazyMintSignatures();
          setLoading(false);
        })
        .mapErr(handleCoreError);
    };

    const submitSignature = (lazyMintingSignature: LazyMintingSignature) => {
      setLoading(true);
      coreProxy.registries
        .executeLazyMint(lazyMintingSignature)
        .map(() => {
          getLazyMintSignatures();
          setLoading(false);
        })
        .mapErr(handleCoreError);
    };

    return (
      <Box>
        <GovernanceWidgetHeader label="Registries Lazy Minting Requests" />

        {hasEmptyState && (
          <GovernanceEmptyState
            title="No registiries lazy minting requests found."
            description="Registiries lazy minting requests submitted by community members will appear here."
          />
        )}

        {lazyMintingSignatures?.map((lazyMintingSignature, index) => (
          <GovernanceRegistryListItem
            key={lazyMintingSignature.tokenId}
            number={(index + 1).toString()}
            title={lazyMintingSignature.tokenId.toString()}
            fieldWithValueList={[
              {
                fieldTitle: "Signature",
                fieldValue: lazyMintingSignature.mintingSignature,
              },
              {
                fieldTitle: "Registrar Address",
                fieldValue: lazyMintingSignature.registrarAddress,
              },
              {
                fieldTitle: "Registry Address",
                fieldValue: lazyMintingSignature.registryAddress,
              },
              {
                fieldTitle: "Token Claimed",
                fieldValue: lazyMintingSignature.tokenClaimed ? "Yes" : "No",
              },
            ]}
            actionButtonList={
              [
                {
                  color: "secondary",
                  label: "Revoke",
                  variant: "text",
                  onClick: () => revokeSignature(lazyMintingSignature),
                },
                {
                  color: "primary",
                  label: "Claim",
                  disabled: lazyMintingSignature.tokenClaimed,
                  onClick: () => submitSignature(lazyMintingSignature),
                },
              ] as IRegistryListItemAction[]
            }
          />
        ))}
      </Box>
    );
  };

export default RegistryLazyMintingRequestsWidget;
