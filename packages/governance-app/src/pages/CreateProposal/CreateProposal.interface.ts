export enum EProposalAction {
  ADD_GATEWAY = "Add Gateway",
  ANOTHER_ACTION = "Another Action",
}

export interface ICreateProposalContext {
  isProposalActionSelectorOpen: boolean;
  toggleProposalActionSelector: () => void;
  selectedProposalAction: EProposalAction;
  setProposalAction: (action: EProposalAction) => void;
}

export interface ICreateProposalProvider {
  children: React.ReactNode;
}
