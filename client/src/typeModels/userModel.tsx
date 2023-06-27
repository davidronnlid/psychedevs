export interface User {
  email: string;
  name: string;
  locale: string;
  email_verified: boolean;
  sub: string;
  sid: string;
}

export type FetchUserResultData = {
  token: string;
  user: User;
} | null;

export type FetchUserResult = {
  success: boolean;
  data: FetchUserResultData;
  error: string | null;
};
