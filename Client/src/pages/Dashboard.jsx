import { useAuth } from '../context/AuthContext';

// Each role gets its own simple view inside one file
const StudentView    = () => <div className="p-8"><h2 className="text-2xl font-bold">Student Dashboard</h2></div>
const OrganizerView  = () => <div className="p-8"><h2 className="text-2xl font-bold">Organizer Dashboard</h2></div>
const FinanceView    = () => <div className="p-8"><h2 className="text-2xl font-bold">Finance Dashboard</h2></div>
const AdminView      = () => <div className="p-8"><h2 className="text-2xl font-bold">Admin Dashboard</h2></div>

export default function Dashboard() {
  const { user, logout } = useAuth();

  const views = {
    student:   <StudentView />,
    organizer: <OrganizerView />,
    finance:   <FinanceView />,
    admin:     <AdminView />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <span className="font-bold text-blue-800">SLIIT EMS</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {user.name} · <span className="capitalize font-medium text-blue-600">{user.role}</span>
          </span>
          <button
            onClick={logout}
            className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      {views[user.role]}
    </div>
  );
}