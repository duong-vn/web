'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { USER_IMAGE } from '@/app/utils/constants';
import { getUserById, putUpdateUser } from '@/app/services/apiServices';
import { toast } from 'react-toastify';
import { PencilIcon } from '@heroicons/react/24/outline';
import Loading from '@/components/layout/Loading';

interface User {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  gender: string;
  image: string | null;
  role: string;
  password:string;
  created_at: string;
}

export default function UpdateUserPage() {
  const { data: session ,status} = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    password: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const [image, setImage] = useState<string | null>(user?.image || null);
  if(status == 'unauthenticated' ){
    window.location.href='/'
}
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.user_id) {
        try {
          const res = await getUserById(session.user.user_id.toString());
          const data = await res.json();
          setUser(data.user);
          setFormData({
            username: data.user.username,
            gender: data.user.gender,
            password: ''
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.user_id) return;

    try {
      const res = await putUpdateUser(
        session.user.user_id,
        user?.full_name || '',
        formData.username,
        formData.password,
        formData.gender,
        user?.role || null,
        image
      );

      if (res.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Refresh user data
        const updatedRes = await getUserById(session.user.user_id.toString());
        const updatedData = await updatedRes.json();
        setUser(updatedData.user);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="p-6 ml-64 mt-20 bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Profile Information</h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <img
                  src={imagePreview || user.image || USER_IMAGE}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 transition-transform group-hover:scale-105"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      <PencilIcon className="h-6 w-6 text-white" />
                    </label>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChangeImage}
                    />
                  </div>
                )}
              </div>
              {isEditing && (
                <p className="mt-2 text-sm text-gray-400">
                  Click on the avatar to change your profile picture
                </p>
              )}
            </div>

            {/* Read-only fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={user.full_name}
                  disabled
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Joined Date</label>
                <input
                  type="text"
                  value={new Date(user.created_at).toLocaleDateString()}
                  disabled
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Editable fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-400">New Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                    className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            {isEditing && (
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user.username,
                      gender: user.gender,
                      password: ''
                    });
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
