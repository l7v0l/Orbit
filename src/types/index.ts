export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface Follower {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  user_id: string;
  post_id: string;
  created_at: string;
}
