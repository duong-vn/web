import { useEffect, useState } from 'react';
import { deleteUser } from '../services/apiServices';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
interface IProps {
  show: boolean;
  setShow: (isOpen: boolean) => void;
  user: User;
  setUser: (user: User | null) => void;
}

const ModalDeleteUser = (props: IProps) => {
  const { show, setShow, user, setUser } = props;

  const handleClose = () => setShow(false);
  const handleConfirm = async () => {
    const res = await deleteUser(user.user_id);
    const data = await res.json();
    if(res.ok){
      toast.info(data.message)
      mutate('/api/users');
      

    }else {
      toast.error(data.message)
    }
    handleClose();
  }

  useEffect(() => {
    console.log("check user>>>", user);
  }, [user]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  DELETE USER
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    This action will permanently delete the user. Are you sure you want to proceed?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={handleConfirm}
            >
              Understood
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDeleteUser;