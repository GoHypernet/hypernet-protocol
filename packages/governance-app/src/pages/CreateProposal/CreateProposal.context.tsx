import React, { useState, useContext, createContext } from "react";
import {
  EProposalAction,
  ICreateProposalContext,
  ICreateProposalProvider,
} from "./CreateProposal.interface";

const CreateProposalContext = createContext({} as ICreateProposalContext);

export function CreateProposalProvider({ children }: ICreateProposalProvider) {
  const [
    isProposalActionSelectorOpen,
    setIsProposalActionSelectorOpen,
  ] = useState(false);

  const [selectedProposalAction, setProposalAction] = useState<EProposalAction>(
    EProposalAction.ADD_GATEWAY,
  );

  const toggleProposalActionSelector = () => {
    setIsProposalActionSelectorOpen((open) => !open);
  };

  const initialState: ICreateProposalContext = {
    isProposalActionSelectorOpen,
    toggleProposalActionSelector,
    selectedProposalAction,
    setProposalAction,
  };

  return (
    <CreateProposalContext.Provider value={initialState}>
      {children}
    </CreateProposalContext.Provider>
  );
}

export const useCreateProposalContext = () => useContext(CreateProposalContext);
