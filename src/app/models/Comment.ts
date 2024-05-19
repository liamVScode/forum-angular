import { UserDto } from "./UserDto";

export interface Comment {
  commentId: string;
  content: string;
  postId: string;
  imageUrls: string[];
  createAt: string;
  updateAt: string;
  userDto: UserDto;
}
