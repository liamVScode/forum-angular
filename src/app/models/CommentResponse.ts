export interface CommentResponse{
  code: number;
  result: {
    commentId: string;
    content: string;
    postId: string;
    imageUrls: string[];
  };

}
