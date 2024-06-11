"use client";

import { debounce } from "@/lib/utils";
import { Button, ButtonGroup } from "@chakra-ui/react";

interface ButtonLayoutProps {
  isStart: boolean;
  startButtonText: string;
  anyChanges: boolean;
  checkForErrorsFunc?: () => Promise<void>;
  handleUndoFunc: () => void;
}

export default function ButtonLayout({
  isStart,
  startButtonText,
  anyChanges,
  checkForErrorsFunc,
  handleUndoFunc,
}: ButtonLayoutProps) {
  return isStart ? (
    <Button
      className="md:w-40 lg:mb-5"
      type="submit"
      onClick={checkForErrorsFunc && debounce(checkForErrorsFunc, 100)}
      variant="websiteColorTheme"
    >
      {startButtonText}
    </Button>
  ) : (
    <ButtonGroup gap={2}>
      <Button
        type="submit"
        isDisabled={!anyChanges}
        onClick={checkForErrorsFunc && debounce(checkForErrorsFunc, 100)}
        variant="websiteColorTheme"
      >
        Save
      </Button>
      <Button
        onClick={debounce(handleUndoFunc, 100)}
        isDisabled={!anyChanges}
        colorScheme="gray"
      >
        Undo
      </Button>
    </ButtonGroup>
  );
}
