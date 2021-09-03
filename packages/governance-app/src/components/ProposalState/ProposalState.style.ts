import { makeStyles } from "@material-ui/core";

interface IProposalStateStyleProps {
  color: string;
}

export const useStyles = makeStyles({
  box: {
    padding: 8,
    borderRadius: 8,
    color: (props: IProposalStateStyleProps) => props.color,
    border: (props: IProposalStateStyleProps) => `1px solid ${props.color}`,
  },
});
