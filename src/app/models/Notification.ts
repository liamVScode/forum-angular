import { UserDto } from "./UserDto";

export interface Notification{
    notificationId: string;
    notificationContent: string;
    type: string;
    status: string;
    createAt: string;
    userDto: UserDto;
    link: string;
}
