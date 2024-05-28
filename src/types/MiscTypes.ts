export interface DropdownOption {
  value: string;
  label: string;
}

export interface FilterTag {
  courseAbrName: string;
  color: string;
}

export interface RelevantSessionProps {
  profilePic: string | null | undefined;
  email: string | null | undefined;
  name: string | null | undefined;
}
