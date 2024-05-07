import { message } from 'antd';

export const showCustomToast = () => {
  const showSuccessToast = (content) => {
    message.success(content, 5);
  };

  const showErrorToast = (content) => {
    message.error(content, 5);
  };

  const showPromiseToast = async (promise, successMessage, errorMessage) => {
    try {
      await promise;
      message.success(successMessage, 5);
    } catch (error) {
      message.error(errorMessage || error.message, 5);
    }
  };

  return { showSuccessToast, showErrorToast, showPromiseToast };
};