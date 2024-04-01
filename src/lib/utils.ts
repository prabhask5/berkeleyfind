import { ToastId } from "@chakra-ui/react";

export const stopLoading = (
  toast: any,
  toastLoadingRef: React.MutableRefObject<ToastId | undefined>,
) => {
  if (toastLoadingRef.current) {
    toast.close(toastLoadingRef.current);
  }
};
