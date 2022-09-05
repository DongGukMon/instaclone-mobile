import Toast from 'react-native-toast-message';

export const showSuccessToast = (text: string) => {
  Toast.show({
    type: 'success',
    text1: text,
    position: 'bottom',
    bottomOffset: 20,
  });
};
