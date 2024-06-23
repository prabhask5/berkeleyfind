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
  email: string;
  name: string | null | undefined;
}
