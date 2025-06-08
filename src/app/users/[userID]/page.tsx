'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { USER_IMAGE } from '@/app/utils/constants';
import Loading from '@/components/layout/Loading';
import { useParams } from 'next/navigation';
import Post from '@/components/layout/Post';

import { getPostsByUserId, getUserById } from '@/app/services/apiServices';
import { useSession } from 'next-auth/react'
interface User {
  user_id: number;
  username: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  created_at: string;
}


export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.userID as string;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<EverythingInPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {data:session} = useSession();
  const fetchUserData = async () => {
    try {
      const userRes = await getUserById(userId)
       const postsRes = await getPostsByUserId(userId);
      
      
      const userData = await userRes.json();
  const postsData = await postsRes.json();
      
      setUser(userData.user);
      setPosts(postsData.posts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  useEffect(() => {

    if (userId) {
      fetchUserData();
      console.log("data to display >>>",user,">>>",posts)
    }
  }, [userId]);

  if (isLoading || !user) {
    return <div className='pt-40'>
      
       <Loading />
       </div>
   
    ;
  }

  return (
    <div className="p-6 ml-64 mt-20 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-gray-800 rounded-2xl shadow-sm p-6 mb-8 border border-gray-700">
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-32">
              <Image
                src={user.image || USER_IMAGE}
                alt={user.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{user.username}</h1>
              {user.name && <p className="text-gray-300 mb-4">{user.name}</p>}
              <div className="flex gap-4 text-sm text-gray-400">
                <span className="capitalize">{user.role}</span>
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User's Posts */}
        <div className="space-y-6">
          <div className='border-b border-gray-600'></div>
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <Post key={post.post_id} post={post} curUser={session?.user?.user_id??0} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 