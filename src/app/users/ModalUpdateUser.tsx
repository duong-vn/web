'use client';
import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import {mutate} from 'swr';
import {toast} from 'react-toastify';
import { putUpdateUser } from '../services/apiServices';
import { ReadonlyURLSearchParams } from 'next/navigation';
interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  user: User 
  setUser: (user: User | null) => void;
}

const ModalUpdateUser = (props: IProps) => {
  const { isModalOpen, setIsModalOpen,user,setUser  } = props;
  const [user_id,setUser_id] = useState(user?.user_id || 0);
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  console.log("check user>>>",user);
  console.log("check user_id>>>",user_id);
 
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || ''); 
  const [password, setPassword] = useState(user?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState(user?.gender);
  const [imagePreview, setImagePreview] = useState<string|null>(user?.image);
  const [image, setImage] = useState(user?.image);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

 
  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file);
      setImagePreview(URL.createObjectURL(file));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          
          setImage(base64Image);
          console.log("check image",image);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail('');
    setFullName('');
    setUsername('');
    setPassword('');
    setGender('');
    setImagePreview(null);
    setUser( null);
  };

  const handleSubmit = async () => {
    

console.log("submitted image>>>",image);
    try {
      const res = await putUpdateUser(user_id,fullName,username,password,gender,image)

      const data = await res.json();
      console.log("Response from server:", data); // Add this line to debug

      if (res.ok) {
        mutate('/api/users');
        toast.success(data.message);
        handleCloseModal();
      } else {
        toast.error(data.message );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating user');
    }
  };

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
   setGender(user.gender);
      setImagePreview(user.image);
      setUser_id(user.user_id);
      setImage(user.image);
    }
  }, [user]);


  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-6 border w-[500px] shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create User</h3>
              <form className="mt-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10 pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-[50%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label 
                    className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    htmlFor="upload-image"
                  >
                    Add Image
                  </label>
                  <input
                    type="file"
                    hidden
                    id="upload-image"
                    onChange={(event) => handleChangeImage(event)}
                    accept="image/*"
                  />
                </div>
              </form>
            </div>

            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Image Preview" className="max-h-48 mx-auto" />
              ) : (
                <div className="text-gray-500">Image preview</div>
              )}
            </div>

            <div className="flex justify-end space-x-3 my-5">
              <button
                type="button"
                onClick={() => handleCloseModal()}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalUpdateUser;
