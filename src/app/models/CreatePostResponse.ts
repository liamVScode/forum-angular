export interface CreatePostResponse {
  code: number;
  result: {
    postId: string;
    categoryDto:  {
      categoryId: string;
      categoryName: string;
    }
  };
}
