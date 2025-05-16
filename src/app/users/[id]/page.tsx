import { getUserById } from '@/app/services/apiServices';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

async function UserProfile({ params }: PageProps) {
  const response = await getUserById(params.id);
  
  if (!response.ok) {
    notFound();
  }

  const user = await response.json();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">Name:</label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-gray-600">Email:</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-600">Role:</label>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Account Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-gray-600">User ID:</label>
                <p className="font-medium">{user.user_id}</p>
              </div>
              <div>
                <label className="text-gray-600">Created At:</label>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-gray-600">Status:</label>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 