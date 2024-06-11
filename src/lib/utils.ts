import berkeleyData from "@/data/berkeleydata";
import { DropdownOption } from "@/types/MiscTypes";
import { ToastId } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import placeholder from "@/media/avatar_placeholder.svg";
import { ActionResponse } from "@/types/RequestDataTypes";

export const stopLoading = (
  toast: any,
  toastLoadingRef: React.MutableRefObject<ToastId | undefined>,
) => {
  if (toastLoadingRef.current) {
    toast.close(toastLoadingRef.current);
  }
};

const filterCourseList = (inputValue: string) => {
  const maxOptions = 50;
  let counter = 1;
  return berkeleyData.selectionCourseOptions.filter((ele) => {
    if (counter >= maxOptions) {
      return false;
    } else {
      const included: boolean = ele.label
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      if (included) {
        counter++;
      }
      return included;
    }
  });
};

export const promiseOptions = (inputValue: string) =>
  new Promise<DropdownOption[]>((resolve) => {
    setTimeout(() => {
      resolve(filterCourseList(inputValue));
    }, 1000);
  });

export const useBetterMediaQuery = ({ query }: { query: string }) => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(!!mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export const turnStringIntoDropdownOption = (
  value: string,
): DropdownOption | null => {
  if (!value) return null;
  return {
    label: value,
    value,
  };
};

export const resolveProfileImageLink = (
  profileImage: string | null | undefined,
) => {
  if (profileImage) return profileImage;
  return placeholder;
};

export const handleError = (toast: any, response: ActionResponse) => {
  const errorMsg = response.responseData;

  toast({
    title: "Unexpected server error",
    description: errorMsg.error,
    status: "error",
    duration: 2000,
    isClosable: false,
  });
};

// wait in milliseconds
export const debounce = (callback: Function, wait: number) => {
  let timeoutId: number | undefined = undefined;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
