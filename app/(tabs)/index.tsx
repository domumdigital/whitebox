import { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDER_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 500);
const SLIDER_HEIGHT = Math.min(SCREEN_HEIGHT * 0.4, 500);
const HANDLE_WIDTH = 32;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const position = useSharedValue(SLIDER_WIDTH / 2);

  const gesture = Gesture.Pan()
    .onChange((event) => {
      const newPosition = Math.max(
        0,
        Math.min(SLIDER_WIDTH, position.value + event.changeX)
      );
      position.value = newPosition;
    })
    .onFinalize(() => {
      position.value = withSpring(position.value, {
        velocity: 100,
        damping: 20,
      });
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value - HANDLE_WIDTH / 2 }],
  }));

  const beforeImageStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  const renderSlider = useCallback(() => {
    return (
      <View style={styles.sliderContainer}>
        <Image
          source={Platform.select({
            default: require('../../assets/images/after.png'),
          })}
          style={styles.image}
          resizeMode="cover"
        />
        <Animated.View style={[styles.beforeImageContainer, beforeImageStyle]}>
          <Image
            source={Platform.select({
              default: require('../../assets/images/before.png'),
            })}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: SLIDER_WIDTH,
              height: SLIDER_HEIGHT,
            }}
            resizeMode="cover"
          />
        </Animated.View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.handle, handleStyle]}>
            <View style={styles.handleLine} />
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' ? insets.top : 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={Platform.select({
              web: {
                uri: 'https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg',
              },
              default: require('../../assets/images/icon.png'),
            })}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to Whitebox</Text>
        <Text style={styles.subtitle}>
          Transform your space with our innovative design solutions
        </Text>
        {renderSlider()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f7f7',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: '100%',
    maxWidth: 280,
    height: 80,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1E1E',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: '80%',
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  beforeImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  handle: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: HANDLE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleLine: {
    width: 4,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
