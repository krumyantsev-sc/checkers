import React, { useState, useEffect } from 'react';
import UsersTable from './UserTable';
import axios from 'axios';
import AuthService from "../../API/AuthService";
import Loading from "../Loading";
import SideMenu from "../SideMenu";
import SearchBar from "./SearchBar";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            const response = await AuthService.getUsers(currentPage);
            console.log(response.data)
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setIsLoading(false);
        }

        fetchUsers();
    }, [currentPage]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleBlockUser = (userId: number) => {

    };
    const handleMakeAdmin = (userId: number) => {

    };

    const handleSearch = (query: string) => {
        console.log('Поисковый запрос:', query);
    };

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div>
            <SideMenu/>
            <div className="users-page">
                <h1>Список пользователей</h1>
                <div className="search-bar-container"><SearchBar onSearch={handleSearch}/></div>
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