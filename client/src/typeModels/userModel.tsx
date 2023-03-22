export interface User {
  username: string;
  _id: string;
  profile_pic_filename?: string;
}

export type FetchUserProfileResult = {
  success: boolean;
  data: User | null;
  error: string | null;
};
