export interface LoginResponse{
  code: number;
  result: {
    token: string;
    refreshToken: string;
    userDto : {
      userId: string;
      email: string;
      avatar: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      location: string;
      website: string;
      about: string;
      skype: string;
      facebook: string;
      twitter: string;
      role: string;
    }
  };
}
