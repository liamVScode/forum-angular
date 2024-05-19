import { UserDto } from "./UserDto";

export interface LikeDto {
  likeId: string;
  createAt: string;
  userDto: UserDto;
  commentId: string;
}
