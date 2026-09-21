import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import Sidebar from './Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#F5EDE3]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h2 className="text-xl font-heading font-semibold text-[#2D3748]">House Of Karma Admin</h2>
          <div className="flex items-center space-x-4">
            <span className="text-[#4A5568] text-sm">
              Welcome, <span className="font-semibold text-[#B85C38]">{session.username}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
