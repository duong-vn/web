import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { getGroupByUserId, postCreatePost } from '../../app/services/apiServices';
import { USER_IMAGE, GROUP_IMAGE } from '../../app/utils/constants';

interface IProps {
  show: boolean;
  setShow: (isOpen: boolean) => void;
  curUser: any;
  group_id:number
}

export default function ModalCreatePost({ show, setShow,curUser,group_id }: IProps) {
  
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchGroups = async () => {
      if (!curUser?.user_id) return;
      
      try {
        const res = await getGroupByUserId(curUser.user_id);
        const data = await res.json();
        setGroups(data);
        console.log("fetched group",data)
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, [curUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
   
  
    e.preventDefault();
    if (!curUser){
      toast.error('Please login to post');
      return;
    }

    if(group_id ===0 ){
      if (!selectedGroup ) {
      toast.error('Please select a group');
      return;
    }}
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }
   
    try {
      const res = await postCreatePost(
        group_id===0 ?Number(selectedGroup) : group_id,
        curUser.user_id,
        content,
        image
      );
     const data = await res.json();

      if (res.ok) {
        toast.success('Post created successfully');
        setShow(false);
        mutate('/api/posts');
        mutate(`/api/posts/group/${group_id}`);
        // Reset form
        setSelectedGroup('');
        setContent('');
        setImage(null);
        setPreviewImage(null);
      } else {
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={() => setShow(false)}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-xl font-bold leading-6 text-white mb-6">
                  Create New Post
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Group Selection */}
            { group_id === 0 &&    ( <div>
                    <label htmlFor="group" className="block text-sm font-medium text-gray-200 mb-2">
                      Select Group
                    </label>
                    <select
                      id="group"
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="mt-1 block p-2 w-full rounded-lg bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="" className="text-gray-400">Select a group</option>
                   {groups.map((group: any) => (
                        <option key={group.group_id} value={group.group_id} className="text-white p-4 pl-4 gap-3">
                                                  
                         {group.group_name}
                        </option>
                      ))}
                    </select>
                  </div>)}

                  {/* Content Input */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
                      Content
                    </label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      className="mt-1 p-4 block w-full rounded-lg bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="What's on your mind?"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Image</label>
                    <div className="mt-1">
                      <div className="flex flex-col items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-400">Click to upload image</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {previewImage && (
                          <button
                            type="button"
                            className="mt-2 inline-flex items-center px-3 py-1.5 border border-red-500 text-sm font-medium rounded-md text-red-500 bg-transparent hover:bg-red-500 hover:text-white transition-colors"
                            onClick={() => {
                              setImage(null);
                              setPreviewImage(null);
                            }}
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              onClick={handleSubmit}
            >
              Create Post
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:mt-0 sm:w-auto"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}