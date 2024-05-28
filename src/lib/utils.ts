import berkeleyData from "@/data/berkeleydata";
import { DropdownOption } from "@/types/MiscTypes";
import { ToastId } from "@chakra-ui/react";
import { useState, useEffect } from "react";

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
