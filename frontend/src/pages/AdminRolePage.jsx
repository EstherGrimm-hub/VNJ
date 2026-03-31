import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserRole } from "../services/userServices";
import { getCurrentUser } from "../utils/storage";

export default function AdminRolePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const user = getCurrentUser();
      // Only load users if user is admin
      if (!user || user.role !== "admin") {
        setLoading(false);
        setError("Bạn không có quyền truy cập trang này.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchUsers();
        setUsers(result.users || []);
      } catch (error) {
        console.error("loadUsers error:", error);
        if (error.message?.includes('401') || error.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError("Không thể tải danh sách người dùng.");
        }
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => (u._id === userId || u.id === userId) ? { ...u, role: newRole } : u));
      alert("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Error updating role:", error);
      if (error.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        alert("Lỗi khi cập nhật quyền: " + (error.message || "Unknown error"));
      }
    }
  };

  return (
    <section className="container" style={{ padding: "30px 0 50px" }}>
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h4>Admin Role Management</h4>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user, index) => (
                  <tr key={user._id || user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Không có user nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
