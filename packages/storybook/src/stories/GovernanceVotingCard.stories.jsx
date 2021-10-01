import { GovernanceVotingCard } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceVotingCard",
  component: GovernanceVotingCard,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    }}
  >
    <div style={{ display: "flex", flexDirection: "row" }}>
      <GovernanceVotingCard
        type="for"
        progressValue={10}
        value={(1, 103, 457)}
      />
      <GovernanceVotingCard type="against" progressValue={20} value={300} />
      <GovernanceVotingCard type="abstain" progressValue={100} value={21312} />
    </div>

    <div style={{ display: "flex", flexDirection: "row" }}>
      <GovernanceVotingCard
        type="for"
        progressValue={10}
        value={(1, 103, 457)}
        isVoted
      />
      <GovernanceVotingCard
        type="against"
        progressValue={20}
        value={300}
        isVoted
      />
      <GovernanceVotingCard
        type="abstain"
        progressValue={100}
        value={21312}
        isVoted
      />
    </div>

    <div style={{ display: "flex", flexDirection: "row" }}>
      <GovernanceVotingCard
        type="for"
        progressValue={10}
        value={(1, 103, 457)}
        disableVoteButton
      />
      <GovernanceVotingCard
        type="against"
        progressValue={20}
        value={300}
        disableVoteButton
      />
      <GovernanceVotingCard
        type="abstain"
        progressValue={100}
        value={21312}
        disableVoteButton
      />
    </div>

    <div style={{ display: "flex", flexDirection: "row" }}>
      <GovernanceVotingCard
        type="for"
        progressValue={10}
        value={(1, 103, 457)}
        showVoteButton={false}
      />
      <GovernanceVotingCard
        type="against"
        progressValue={20}
        value={300}
        showVoteButton={false}
      />
      <GovernanceVotingCard
        type="abstain"
        progressValue={100}
        value={21312}
        showVoteButton={false}
      />
    </div>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
