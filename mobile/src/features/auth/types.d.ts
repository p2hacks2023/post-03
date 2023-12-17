export type AuthState = {
  initializing: boolean;
  user: {
    uid: string
  } | undefined
};
