'use client';
import { useState } from 'react';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { createGroup } from '../services/apiServices';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { API_URL } from '../utils/constants';

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  created_by: number | null;
  fetchGroups: ()=>void;
  getJoinedGroup : ()=>void;
}

const ModalCreateGroup = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, created_by,fetchGroups,getJoinedGroup } = props;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>('public');

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setDescription('');
    setImagePreview(null);
    setImage(null);
    setPrivacy('public');
 
  };

  const handleSubmit = async () => {
    try {
      const res = await createGroup(name, description, image, created_by, privacy);
      const data = await res.json();

      if (res.ok) {
        
        toast.success('Group created successfully');
        fetchGroups();
        getJoinedGroup();
        handleCloseModal();
        
      } else {
        toast.error(data.message || 'Error creating group');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating group');
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-700">
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Create New Group
                </h3>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter group name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter group description"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label
                      className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                      htmlFor="upload-image"
                    >
                      Add Group Image
                    </label>
                    <select
                      className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value)}
                    >
                      <option value="">Choose Privacy</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <input
                    type="file"
                    hidden
                    id="upload-image"
                    onChange={handleChangeImage}
                    accept="image/*"
                  />
                </form>

                <div className="mt-6 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Group Image Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400">Group image preview</div>
                  )}
                </div>
              </div>

              <div className="bg-gray-700/50 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCreateGroup;
