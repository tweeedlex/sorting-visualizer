export type LoginResponse = {
  token: string;
  expiresIn: number;
  user: User;
  settings: Settings;
};

export type User = {
  userId: number;
  username: string;
  fullName: string;
  is_premium: boolean | null;
  avatarFileName: string;
  avatarFileId: string;
  UIUpdated: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
  install_datetime: string;
  _id: string;
  code: string;
  __v: number;
};

export type Settings = {
  supportUsername: string;
  adminChannelId: number;
  inviteCode: string;
  allLessonsAmount: number;
  _id: string;
  __v: number;
};
