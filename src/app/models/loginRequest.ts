export interface LoginResponse{
  code: number;
  result: {
    token: string;
    refreshToken: string;
  };
}
