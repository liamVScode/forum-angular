export interface EditPostResponse {
  code: number;
  result: {
    postId: string;
    categoryDto: {
      categoryId: string;
      categoryName: string;
    }
  };
}
