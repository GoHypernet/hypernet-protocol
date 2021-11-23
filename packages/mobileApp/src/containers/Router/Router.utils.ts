import { StackCardInterpolationProps } from "@react-navigation/stack";

export const cardStyleInterpolator = ({
  current: { progress },
  next,
  layouts,
}: StackCardInterpolationProps) => ({
  cardStyle: {
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),
      },
      {
        translateX: next
          ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -layouts.screen.width],
            })
          : 1,
      },
    ],
  },
});
