"use client";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { putUpdateUser } from "../services/apiServices";
import { useSession } from "next-auth/react";
import { ReadonlyURLSearchParams } from "next/navigation";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  user: User;
  setUser: (user: User | null) => void;
}

const ModalUpdateUser = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, user, setUser } = props;
  const [user_id, setUser_id] = useState(user?.user_id || 0);
  const [role, setRole] = useState<string | null>(user?.role || null);
  const [fullName, setFullName] = useState(user?.full_name || "");
  console.log("check user>>>", user);
  console.log("check user_id>>>", user_id);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState(user?.gender?? 'Other');
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image);
  const [image, setImage] = useState(user?.image);

  const { data: session } = useSession();
  const [curRole, setCurRole] = useState<string | null>(
    session?.user?.role || null
  );
  // const [role, setRole] = useState<string | null>("admin");
  console.log(
    "check curRole from update user and selected role ",
    curRole,
    role
  );

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
          console.log("check image", image);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setFullName("");
    setUsername("");
    setPassword("");
    setGender("");
    setImagePreview(null);
    setUser(null);
  };

  const handleSubmit = async () => {
    console.log("submitted image>>>", image);
    try {
      const res = await putUpdateUser(
        user_id,
        fullName,
        username,
        password,
        gender,
        role,
        image
      );
      console.log("Response from server that havent json:", res); // Add this line to debug
      const data = await res.json();
      console.log("Response from server:", data); // Add this line to debug

      if (res.ok) {
        mutate("/api/users");
        toast.success(data.message);
        handleCloseModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error creating user");
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
      setRole(user.role);
    }
  }, [user]);

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
                  {curRole === "admin" ? "Update User" : "View Profile"}
                </h3>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      readOnly={curRole !== "admin"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      readOnly={curRole !== "admin"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password (optional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {curRole === "admin" && (
                    <div className="mt-4">
                      <label
                        className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                        htmlFor="upload-image"
                      >
                        Add Image
                      </label>
                      <input
                        type="file"
                        hidden
                        id="upload-image"
                        onChange={handleChangeImage}
                        accept="image/*"
                      />
                    </div>
                  )}
                </form>

                <div className="mt-6 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400">Image preview</div>
                  )}
                </div>
              </div>

              <div className="bg-gray-700/50 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {curRole !== "admin" ? "Exit" : "Cancel"}
                </button>
                {curRole === "admin" && (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalUpdateUser;
