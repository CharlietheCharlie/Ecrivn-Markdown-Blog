type TPost = {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
  commentCount: number;
};

type TComment = {
    id: string;
    userName: string;
    content: string;
    createdAt: string;
  };

export type { TPost, TComment };