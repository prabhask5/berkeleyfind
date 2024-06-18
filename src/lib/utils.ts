import berkeleyData from "@/data/berkeleydata";
import { DropdownOption } from "@/types/MiscTypes";
import { ToastId } from "@chakra-ui/react";
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

export const serverActionToAPI = async (serverAction: Function, data?: any) => {
  let actionResponse: ActionResponse;

  if (data) {
    actionResponse = JSON.parse(await serverAction(JSON.stringify(data), true));
  } else {
    actionResponse = JSON.parse(await serverAction(true));
  }

  return Response.json(actionResponse.responseData, {
    status: actionResponse.status,
  });
};

export function sample<T>(array: Array<T>, numSamples: number) {
  const usedIndices: Array<number> = [];
  for (let i = 0; i < numSamples; i++) {
    let found = false;
    while (!found) {
      const index = Math.floor(Math.random() * array.length);
      if (!usedIndices.includes(index)) {
        usedIndices.push(index);
        found = true;
      }
    }
  }

  return array.filter((_value, index) => usedIndices.includes(index));
}
