import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { HomeGlazerBlogAiPanel } from '@/components/admin/HomeGlazerBlogAiPanel';

export default function AdminBlogAiPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <HomeGlazerBlogAiPanel />
      </AdminLayout>
    </ProtectedRoute>
  );
}
