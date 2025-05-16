const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const postCreateUser = (full_name: string, username: string, email: string, password: string, gender: string, image: string | null) => {
    return fetch("/api/users", { // Ensure this is your correct API endpoint for creating users
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            full_name,
            username,
            email,
            password,
            gender,
            image, // This will be the Base64 string or null
        }),
    });
};

const putUpdateUser = (user_id:number,full_name: string, username: string, password: string, gender: string, image: string | null) => {
return fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          full_name,
          username,
          password,
          gender,
          image
         
        })
      })



}

const deleteUser = (user_id: number) => {
    return fetch(`/api/users`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id
        }),
    });
}

export const getUserById = async (id: string) => {
  return fetch(`${API_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Group Services
export const getGroups = async () => {
  return fetch(`${API_URL}/groups`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getGroupById = async (id: string) => {
  return fetch(`${API_URL}/groups/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createGroup = (name: string, description: string) => {
  return fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });
};

export const updateGroup = (group_id: number, name: string, description: string) => {
  return fetch(`${API_URL}/groups`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      group_id,
      name,
      description,
    }),
  });
};

export const deleteGroup = (group_id: number) => {
  return fetch(`${API_URL}/groups`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      group_id,
    }),
  });
};

export { postCreateUser, putUpdateUser, deleteUser,
    
 };