import React, {useState} from 'react';
import '../../styles/UserList.css';
import UserModal from "./UserModal";

interface User {
    id: number;
    username: string;
    roles: [{name: string}];
    email: string;
}

interface UsersTableProps {
    users: User[];
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    onBlockUser: (userId: number) => void;
    onMakeAdmin: (userId: number) => void;
}

const UserTable: React.FC<UsersTableProps> = (
    {
        users,
        totalPages,
        onPageChange,
        onBlockUser,
        onMakeAdmin
    }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleClickOpen = (id: number) => {
        setUserId(id);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li
                    key={i}
                    onClick={() => onPageChange(i)}>
                    {i}
                </li>
            );
        }
        return <ul className="pagination">{pageNumbers}</ul>;
    };

    return (
        <div
            className="users-table-container">
            <table
                className="users-table">
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
                    <tr
                        key={user.id}>
                        <td>
                            <div
                                className="user-info-admin-button"
                                onClick={() => handleClickOpen(user.id)}
                                style={{color: "#3ed2f0"}}>
                                {user.id}
                            </div>
                        </td>
                        <UserModal
                            userId={userId}
                            isOpen={modalOpen}
                            onClose={handleClose}
                        />
                        <td>{user.username}</td>
                        <td
                            className="role-td">
                            {user.roles.map((role) => {
                                return role.name + " "
                            })}
                        </td>
                        <td>{user.email}</td>
                        <td
                            className="button-table-cell">
                            <button
                                onClick={() => onBlockUser(user.id)}
                                className="ban-button">
                                Ban
                            </button>
                            <button
                                onClick={() => onMakeAdmin(user.id)}
                                className="make-admin-button">
                                Make admin
                            </button>
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