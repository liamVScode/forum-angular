import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserDto } from '../../models/UserDto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent  implements OnInit, AfterViewInit{
  @ViewChild('chatContainer') private chatContainer?: ElementRef;

  currentUser?: UserDto | null;
  messageInput: string = '';
  messageList: any[] = [];
  chatId: string = "";
  userId: string = "";

  chatName: string = "";
  chatType: string = '0';
  userIdCreate: string[] = [];

  chats: any[] = [];

  chatExists: boolean = false;

  constructor(private chatService: ChatService, private route: ActivatedRoute, private authService: AuthService,
    private router: Router
  ){
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        setTimeout(() => {
          this.chatContainer!.nativeElement.scrollTop = this.chatContainer!.nativeElement.scrollHeight;
        }, 100); //delay
      }
    } catch (err) {
      console.error('Scroll to bottom failed', err);
    }
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userId = this.route.snapshot.params['userId'];
    this.ChatWithUser(this.userId);
    this.loadAllChatByCurrentUser();
    this.listenerMessage();
  }

  ChatWithUser(userId: string){
    this.chatService.loadChatWithUser(userId).subscribe({
      next: (response: any) => {
        if (response?.result) {
          this.chatExists = true;
          this.chatId = response.result.chatId;
          this.loadChatByChatId(this.chatId);
        } else {
          this.chatExists = false;
        }
      }
    });
  }

  loadChatByChatId(chatId: string){
    this.chatService.loadChat(chatId);
    this.scrollToBottom();
  }

  loadAllChatByCurrentUser(){
    this.chatService.loadAllChatByUser().subscribe({
      next: (response: any) => {
        this.chats = response?.result;
      }
    });
  }

  createChat(){
    this.userIdCreate.push(this.userId);
    if (this.currentUser?.userId) {
      this.userIdCreate.push(this.currentUser.userId);
    }
    this.chatService.createChat(this.chatName, this.chatType, this.userIdCreate).subscribe({
      next: (response: any) => {
        this.chats.push(response?.result);
        this.loadChatByChatId(response?.result?.chatId);
        this.chatExists = true;
        this.scrollToBottom();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  sendMessage(){
    const message = {
      chatId: this.chatId,
      userId: this.currentUser?.userId,
      messageContent: this.messageInput
    }
    this.chatService.sendMessage(this.chatId, message);
    this.messageInput = '';
    this.scrollToBottom();
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any[]) => {
      this.messageList = messages.map((message: any) => ({
        ...message,
        sendOrReceive: Number(message.userDto.userId) === Number(this.currentUser?.userId) ? 'sender' : 'receiver',
      }))
      this.scrollToBottom();
    });
  }
}
