import React, {useState} from 'react';
import '../../styles/UserList.css';
import UserModal from "./UserModal";

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
                    <th>ID</th>
                    <th>Имя пользователя</th>
                    <th>Роли</th>
                    <th>Email</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr
                        key={user._id}>
                        <td>
                            <div
                                className="user-info-admin-button"
                                onClick={() => handleClickOpen(user._id)}
                                style={{color: "#3ed2f0"}}>
                                {user._id}
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
                            {user.role.map((role) => {
                                return <span style={role === "BANNED" ? {color: "red"} : (role === "ADMIN" ? {color: "green"}: {})}>{role + " "}</span>
                            })}
                        </td>
                        <td>{user.email}</td>
                        <td
                            className="button-table-cell">
                            {!user.role.includes("BANNED") &&
                            <button
                                onClick={() => onBlockUser(user._id)}
                                className="ban-button">
                                Заблокировать
                            </button> }
                            {!user.role.includes("ADMIN") &&
                                <button
                                    style={{paddingTop:8, paddingLeft:17}}
                                    onClick={() => onMakeAdmin(user._id)}
                                    className="make-admin-button">
                                    Сделать<br/> администратором
                                </button>
                            }
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