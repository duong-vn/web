import { use } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const postCreateUser = (
  full_name: string,
  username: string,
  email: string,
  password: string,
  gender: string,
  role: string,
  image: string | null
) => {
  return fetch("/api/users", {
    // Ensure this is your correct API endpoint for creating users
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name,
      username,
      email,
      password,
      gender,
      role,
      image, // This will be the Base64 string or null
    }),
  });
};

const putUpdateUser = (
  user_id: number,
  full_name: string,
  username: string,
  password: string,
  gender: string,
  role: string | null,
  image: string | null
) => {
  return fetch("/api/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      full_name,
      username,
      password,
      gender,
      role,
      image,
    }),
  });
};

const deleteUser = (user_id: number) => {
  return fetch(`/api/users`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
    }),
  });
};

export const getUserById = async (user_id: string) => {
  return fetch(`${API_URL}/users/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Group Services
export const getGroups = async () => {
  return fetch(`${API_URL}/groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getGroupByGroupId = async (group_id: string) => {
  return fetch(`${API_URL}/groups?group_id=${group_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};




export const createGroup = (
  name: string,
  description: string,
  image: string | null,
  created_by: number | null,
  privacy: string
) => {
  return fetch(`${API_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      group_name: name,
      description,
      image,
      created_by,
      privacy,
    }),
  });
};

export const updateGroup = (
  group_id: number,
  name: string,
  description: string
) => {
  return fetch(`${API_URL}/groups`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      group_id,
      name,
      description,
    }),
  });
};
export const getGroupByUserId = async (user_id: number) => {
  return fetch(`${API_URL}/groups?user_id=${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteGroup = (group_id: number) => {
  return fetch(`${API_URL}/groups`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      group_id,
    }),
  });
};

export const postLogin = async (email: string, password: string) => {
  return fetch(`${API_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};
export const deleteReaction = async (user_id : number , post_id : number) => {
  return await fetch(`${API_URL}/reactions`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      post_id
    }),
  });
};
export const postCreateComment = async (
  post_id: number,
  user_id: number,
  content: string
) => {
  return await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      post_id,
      user_id,
      content,
    }),
  });
};

export const deleteComment = async (comment_id: number) => {
  return fetch(`${API_URL}/comments/${comment_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getComments = async (post_id: number) => {
  return fetch(`${API_URL}/comments/all?post_id=${post_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getPosts = async () => {
  return fetch(`${API_URL}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getPostsByUserId = async (user_id:string) => {
  return fetch(`${API_URL}/posts/user/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getReactionsByPostId = async (post_id : number) =>{
  return fetch(`${API_URL}/reactions?post_id=${post_id}`,{
    method : "GET",
    headers : {
      "Content-Type": "application/json",
    }
  })
}
export const isLikePost = (post_id:number,user_id:number) => {
  return fetch(`${API_URL}/reactions?post_id=${post_id}&&user_id=${user_id}`,{
    method : "GET",
    headers : {
      "Content-Type": "application/json",
    }
  })
}
export const getReactionsByCommentId = async (post_id : number) =>{
  return fetch(`${API_URL}/reactions?post_id=${post_id}`,{
    method : "GET",
    headers : {
      "Content-Type": "application/json",
    }
  })
}
export const postCreateReactionByPostId = async ( user_id: number,post_id:number) => {
  return fetch(`${API_URL}/reactions?post_id=${post_id}`,{
    method : "POST",
    headers : {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id
    })
  })
}

export const postJoinGroup = (user_id: number,group_id:number) => {
  return fetch(`${API_URL}/groups/join?user_id=${user_id}&&group_id=${group_id}`,{
    method : "POST",
    headers : {
      "Content-Type": "application/json",
    }
   
  })
}

export const postCreatePost = async (group_id: number, user_id: number, content: string, image: string | null) => {
  return fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      group_id,
      user_id,
      content,
      image
    }),
  });
};

export const deletePost = async (post_id: number) => {
  return fetch(`${API_URL}/posts/${post_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const leaveGroup = async (group_id: number, user_id: number) => {
  
    return await fetch(`${API_URL}/groups/leave?group_id=${group_id}&user_id=${user_id}`, {
      method: 'DELETE',
    });
    
   
};
export const  isJoinedGroup = async (group_id: number, user_id: number) => {
  
  return await fetch(`${API_URL}/groups/join?group_id=${group_id}&user_id=${user_id}`, {
    method: 'GET',
  });
}

export { postCreateUser, putUpdateUser, deleteUser };
