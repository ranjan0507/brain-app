export type Category = {
  _id: string;
  name: string;
};

export type ContentItem = {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  url?: string;
  createdAt?: string;
  favorite?: boolean;
  categoryId?: string;
  tags?: string[];
  userId?: string;
};
