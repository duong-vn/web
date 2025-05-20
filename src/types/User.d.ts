interface User {
    user_id: number;
    full_name: string;
    username: string;
    email: string;
    gender: string;
    password: string;
    image: string;
    role: string;
}

interface Group {
    group_id: number;
    group_name: string;
    created_by: number;
    description:string,
    number_of_posts: number;
    number_of_members: number;
    created_at: string;
    image:string;
  }

  type UserWithRole = {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  password: string;
  gender: string | null;
  created_at: Date;
  image: string | null;
  group_id: number | null;
  role: string | null;
  joined_at: Date | null;
};

