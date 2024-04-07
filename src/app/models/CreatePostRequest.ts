export interface CreatePostRequest {
  title: string;
  prefixId : string;
  categoryId: string;
  commentContent: string;
  imageUrls: string[];
  pollQuestion: string;
  maximumSelectableResponses : number;
  isUnlimited:boolean;
  changeVote:boolean;
  viewResultNoVote:boolean;
  pollResponses: string[];
}
