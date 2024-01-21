export type User = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  is_confirmed: boolean;
  avatar?: string;
};

export type Board = {
  id: number;
  user_id: string;
  title: string;
  color: string;
  slug: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    raw_user_meta_data: {
      fullname: string;
      username: string;
      avatar?: string;
    };
  };
};

export type List = {
  id: number;
  board_id: number;
  index: number;
  title: string;
  created_at: string;
};

export type DueDate = {
  id: number;
  card_id: number;
  timestamp: string;
  is_done: boolean;
  created_at: string;
};

export type Check = {
  id: number;
  card_id: number;
  index: number;
  content: string;
  is_checked: boolean;
  created_at: string;
};

export type Card = {
  id: number;
  list_id: number;
  index: number;
  title: string;
  description: string;
  slug: string;
  has_checklist: boolean;
  created_at: string;
  checks: Check[];
  due_dates: DueDate[];
};

export type BoardMember = {
  id: number;
  board_id: number;
  user_id: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    raw_user_meta_data: {
      fullname: string;
      username: string;
      avatar?: string;
    };
  };
};
