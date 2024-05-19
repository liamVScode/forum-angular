import { UserDto } from "./UserDto";

export interface Message {
  msgId: string;
  content: string;
  userDto: UserDto;
  chatId: string;
  t_stamp: string;
}
