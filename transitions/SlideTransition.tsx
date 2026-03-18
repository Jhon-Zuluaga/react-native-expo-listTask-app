import { Easing } from "react-native";

export const SlideTransition = {
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
  }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0], // deslizar de abajo hasta arriba
            }),
          },
        ],
      },
    };
  },
};
