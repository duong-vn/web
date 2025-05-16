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

export { postCreateUser, putUpdateUser,deleteUser };