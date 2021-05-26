import React from "react";
import {
  Button,
  GU,
  Info,
  Field,
  SidePanel,
  TextInput,
  useSidePanelFocusOnReady,
} from "@aragon/ui";

const initialState = {
  question: "",
  url: "",
  wallet: "",
  signature: "",
};

const NewVotePanel = React.memo(({ panelState, onCreateVote }) => {
  return (
    <SidePanel
      title="New Vote"
      opened={panelState.visible}
      onClose={panelState.requestClose}
      onTransitionEnd={panelState.onTransitionEnd}
    >
      <NewVotePanelContent
        onCreateVote={onCreateVote}
        panelOpened={panelState.didOpen}
      />
    </SidePanel>
  );
});

class NewVotePanelContent extends React.PureComponent {
  static defaultProps = {
    onCreateVote: () => {},
  };
  state = {
    ...initialState,
  };
  componentWillReceiveProps({ panelOpened }) {
    if (panelOpened && !this.props.panelOpened) {
      // setTimeout is needed as a small hack to wait until the input's on
      // screen until we call focus
      // this.questionInput && setTimeout(() => this.questionInput.focus(), 0)
      // const inputRef = useSidePanelFocusOnReady()
    } else if (!panelOpened && this.props.panelOpened) {
      // Finished closing the panel, so reset its state
      this.setState({ ...initialState });
    }
  }
  handleQuestionChange = (event) => {
    this.setState({ question: event.target.value });
  };

  handleUrlChange = (event) => {
    this.setState({ url: event.target.value });
  };
  handleWalletChange = (event) => {
    this.setState({ wallet: event.target.value });
  };
  handleSignatureChange = (event) => {
    this.setState({ signature: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const metadata =
      this.state.question.trim().replaceAll("\n", "") +
      "\n" +
      this.state.url.trim().replaceAll("\n", "") +
      "\n" +
      this.state.wallet.trim().replaceAll("\n", "") +
      "\n" +
      this.state.signature.trim().replaceAll("\n", "");
    this.props.onCreateVote(metadata);
  };
  render() {
    const { question, url, wallet, signature } = this.state;
    return (
      <div>
        <form
          css={`
            margin-top: ${3 * GU}px;
          `}
          onSubmit={this.handleSubmit}
        >
          <Field label="URL">
            <TextInput
              value={url}
              onChange={this.handleUrlChange}
              required
              wide
            />
          </Field>
          <Field label="Wallet">
            <TextInput
              value={wallet}
              onChange={this.handleWalletChange}
              required
              wide
            />
          </Field>
          <Field label="Signature">
            <TextInput
              value={signature}
              onChange={this.handleSignatureChange}
              required
              wide
            />
          </Field>
          <Field label="Question">
            <TextInput
              // ref={question => (this.questionInput = question)}
              value={question}
              onChange={this.handleQuestionChange}
              required
              wide
            />
          </Field>
          <div
            css={`
              margin-bottom: ${3 * GU}px;
            `}
          >
            <Info>
              These votes are informative and used for signaling. They don’t
              have any direct repercussions on the organization.
            </Info>
          </div>
          <Button
            disabled={!question && !url && !wallet && !signature}
            mode="strong"
            type="submit"
            wide
          >
            Create new vote
          </Button>
        </form>
      </div>
    );
  }
}

export default NewVotePanel;
