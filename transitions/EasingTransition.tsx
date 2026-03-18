import { Easing } from "react-native";

export const customTransition = {
  TransitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      },
    },
  },

  cardStyleInterpolator: ({
    current,
    layouts,
  }: {
    current: any;
    layouts: any;
  }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};
