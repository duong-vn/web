'use client';
import { useState } from 'react';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { createGroup } from '../services/apiServices';
import {API_URL} from '../utils/constants';
interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  created_by:number | null;
}

const ModalCreateGroup = (props: IProps) => {
  const { isModalOpen, setIsModalOpen,created_by } = props;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

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
  };

  const handleSubmit = async () => {
    console.log('Submitting form with:', { name, description, image });


    try {
      const res = await createGroup(name, description,image,created_by);
      const data = await res.json();

      if (res.ok) {
        console.log('Group created successfully:', data);
        console.log("mutating group data");
        mutate('api/groups');
        toast.success('Group created successfully ok');
        handleCloseModal();
      } else {
        toast.error(data.message || 'Error creating group');
        console.log("errrorr from create group",data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating group');
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-6 border w-[500px] shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Group</h3>
              <form className="mt-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Group Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
                <div className="mt-4">
                  <label 
                    className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    htmlFor="upload-image"
                  >
                    Add Group Image
                  </label>
                  <input
                    type="file"
                    hidden
                    id="upload-image"
                    onChange={handleChangeImage}
                    accept="image/*"
                  />
                </div>
              </form>
            </div>

            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Group Image Preview" className="max-h-48 mx-auto" />
              ) : (
                <div className="text-gray-500">Group image preview</div>
              )}
            </div>

            <div className="flex justify-end space-x-3 my-5">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCreateGroup;
