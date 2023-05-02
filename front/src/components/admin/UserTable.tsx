import React from 'react';
import '../../styles/UserList.css';

interface User {
    _id: number;
    username: string;
    role: string[];
    email: string;
}

interface UsersTableProps {
    users: User[];
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    onBlockUser: (userId: number) => void;
    onMakeAdmin: (userId: number) => void;
}

const UserTable: React.FC<UsersTableProps> = ({ users, totalPages, onPageChange, onBlockUser, onMakeAdmin }) => {
    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i} onClick={() => onPageChange(i)}>
                    {i}
                </li>
            );
        }
        return <ul className="pagination">{pageNumbers}</ul>;
    };

    return (
        <div className="users-table-container">
            <table className="users-table">
                <thead>
                <tr>
                    <th>id</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.username}</td>
                        <td className="role-td">{user.role.map((role) => {return role + " "})}</td>
                        <td>{user.email}</td>
                        <td className="button-table-cell">
                            <button
                                onClick={() => onBlockUser(user._id)}
                                className="ban-button"
                            >Заблокировать</button>
                            <button
                                onClick={() => onMakeAdmin(user._id)}
                                className="make-admin-button"
                            >Сделать администратором</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    );
};

export default UserTable;