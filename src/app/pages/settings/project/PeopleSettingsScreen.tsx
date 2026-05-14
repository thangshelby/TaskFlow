import React, { useState } from "react";
import { Search, UserPlus, MoreVertical, Shield } from "lucide-react";

export const PeopleSettingsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Mock data for display
  const members = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member', avatar: 'JS' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', avatar: 'BW' },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="mx-auto w-full max-w-5xl px-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">People & Permissions</h2>
            <p className="text-sm text-gray-500 mt-1">Manage project members and their access roles.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite People
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                        {member.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                       {member.role === 'Admin' && <Shield className="h-4 w-4 text-indigo-600" />}
                       <select 
                         className="text-sm border-0 bg-transparent py-1 pl-1 pr-6 focus:ring-0 cursor-pointer font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                         defaultValue={member.role}
                       >
                         <option>Admin</option>
                         <option>Member</option>
                         <option>Viewer</option>
                       </select>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100 p-2">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
