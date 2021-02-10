import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {NavigationProps} from '@mobileApp/interfaces/containers/IRouter';

import {splashAnimation} from './animation';

interface MainHomeProps {
  navigation: NavigationProps;
}

const Splash: React.FC<MainHomeProps> = (props: MainHomeProps) => {
  const {navigation} = props;
  const animationRef = useRef<LottieView>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      {showAnimation && (
        <LottieView
          ref={animationRef}
          source={splashAnimation}
          autoPlay
          loop={false}
          onAnimationFinish={() => {
            navigation.navigate('Login');
            setShowAnimation(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default Splash;
