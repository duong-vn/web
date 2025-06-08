"use client";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { postCreateUser } from "@/app/services/apiServices";
import { useRouter } from "next/navigation";
interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const ModalCreateUser = (props: IProps) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");
  const [role, setRole] = useState<string>("user"); // Default role set to 'user'
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<any | null>(null);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const router = useRouter();
  const validateEmail = (e: string) => {
    return isValidEmail.test(e);
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file)); // For visual preview

      // Convert file to Base64 and set it in state
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Set image state to Base64 string
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    console.log(">>updated image", typeof image, image);
  }, [image]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setFullName("");
    setUsername("");
    setPassword("");
    setGender("");
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    console.log("submitting image>>>", image);
    try {
      const res = await postCreateUser(
        fullName,
        username,
        email,
        password,
        gender,
        role,
        image
      );

      const data = await res.json();
      console.log("Response from server:", data); // Add this line to debug

      if (res.ok) {
        mutate("/api/users");
        toast.success("User created successfully");
        router.push("/auth/login");
      } else {
        toast.error(data.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error creating user");
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-6 border w-[500px] shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Register
              </h3>
              <form className="mt-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 px-4 py-2 h-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
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
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-h-48 mx-auto"
                />
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
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCreateUser;
