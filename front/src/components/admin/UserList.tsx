import React, {useState, useEffect} from 'react';
import UsersTable from './UserTable';
import AuthService from "../../API/AuthService";
import Loading from "../Loading";
import SideMenu from "../SideMenu";
import SearchBar from "./SearchBar";
import {useModal} from "../Modal/ModalContext";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);
    const {showModal} = useModal();

    async function fetchUsers() {
        const response = await AuthService.getUsers(currentPage);
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleBlockUser = (userId: number) => {
        AuthService.ban(userId).then((res) => {
            showModal(res.data.message);
            fetchUsers();
        })
            .catch((err) => {
                if (err.response && err.response.status === 409) {
                    showModal(err.response.data.message);
                } else {
                    showModal('Error occurred while blocking user');
                }
            });
    };

    const handleMakeAdmin = (userId: number) => {
        AuthService.makeAdmin(userId).then((res) => {
            showModal(res.data.message);
            fetchUsers();
        })
            .catch((err) => {
                if (err.response && err.response.status === 409) {
                    showModal(err.response.data.message);
                } else {
                    showModal('Error occurred while making user an admin');
                }
            });
    };

    const handleSearch = (query: string) => {
        console.log('Поисковый запрос:', query);
        AuthService.searchUsers(query).then((res) => {
            setUsers(res.data)
        })
    };

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div>
            <SideMenu/>
            <div
                className="users-page">
                <h1>User List</h1>
                <div
                    className="search-bar-container">
                    <SearchBar
                        onSearch={handleSearch}
                    />
                </div>
                <UsersTable
                    users={users}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onBlockUser={handleBlockUser}
                    onMakeAdmin={handleMakeAdmin}
                />
            </div>
        </div>
    )
}

export default UserList;