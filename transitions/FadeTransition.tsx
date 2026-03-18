import { Easing } from "react-native";

export const fadeTransition = {
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

  cardStyleInterpolator: ({ current }: { current: any }) => {
    return {
      cardStyle: {
        opacity: current.progress, // Interpolar la opacidad para hacer el efecto fade
      },    
    };
  },
};
