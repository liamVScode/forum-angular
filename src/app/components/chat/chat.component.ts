import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent  implements OnInit{

  messageInput: string = '';
  userId: string = "";
  messageList: any[] = [];

  constructor(private chatService: ChatService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.chatService.joinRoom(1);
    this.chatService.loadChat();
    this.listenerMessage();
  }

  sendMessage(){
    const message = {
      content: this.messageInput,
      userId: this.userId,
      chatId: 1
    } as Message
    this.chatService.sendMessage(1, message);
    this.messageInput = '';
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any[]) => {
      this.messageList = messages.map((message: any) => ({
        ...message,
        sendOrReceive: Number(message.userId) === Number(this.userId) ? 'sender' : 'receiver',
      }))
    });

  }
}
