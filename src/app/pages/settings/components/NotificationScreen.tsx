import React, { useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";

export const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState({
    issueAssigned: { email: true, push: true, inApp: true },
    issueMentioned: { email: true, push: true, inApp: true },
    projectUpdates: { email: false, push: false, inApp: true },
  });

  const toggleNotification = (event: keyof typeof notifications, channel: 'email' | 'push' | 'inApp') => {
    setNotifications(prev => ({
      ...prev,
      [event]: {
        ...prev[event],
        [channel]: !prev[event][channel]
      }
    }));
  };

  const renderToggle = (event: keyof typeof notifications, channel: 'email' | 'push' | 'inApp') => {
    const isActive = notifications[event][channel];
    return (
      <button 
        onClick={() => toggleNotification(event, channel)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isActive ? 'bg-emerald-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-4.5' : 'translate-x-1'}`} />
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="mb-2 text-2xl font-semibold text-[#1a1c1c] font-manrope">
          Notifications
        </h2>
        <p className="text-[#404944]">Choose how and when you want to be notified about activity.</p>
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Activity</th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <Smartphone className="h-4 w-4" /> Push
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <Bell className="h-4 w-4" /> In-App
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Issue Assigned</div>
                <div className="text-sm text-gray-500">When an issue is assigned to you.</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('issueAssigned', 'email')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('issueAssigned', 'push')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('issueAssigned', 'inApp')}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Mentions</div>
                <div className="text-sm text-gray-500">When someone @mentions you in a comment.</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('issueMentioned', 'email')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('issueMentioned', 'push')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('issueMentioned', 'inApp')}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Project Updates</div>
                <div className="text-sm text-gray-500">Weekly summaries and project digests.</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('projectUpdates', 'email')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('projectUpdates', 'push')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                {renderToggle('projectUpdates', 'inApp')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
