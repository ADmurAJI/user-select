import React, { useState, useEffect, useCallback } from 'react';

import styles from './UserSelect.module.scss';

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	job: string;
}

const API_URL = 'https://alanbase.vercel.app/api/users';

const UserSelect: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [totalUsers, setTotalUsers] = useState<number>(0);
	
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const { data, meta } = await (await fetch(`${API_URL}?page=${page}&limit=50`)).json();
			setUsers((prevUsers) => {
				const uniqueUsers = data.filter((newUser: { id: number; }) => !prevUsers.some((user) => user.id === newUser.id));
				return [...prevUsers, ...uniqueUsers];
			});
			setTotalUsers(meta.total);
		} catch (error) {
			console.error('Ошибка при получении пользователей:', error);
		} finally {
			setLoading(false);
		}
	}, [page]);
	
	useEffect(() => {
		fetchUsers().then();
	}, [fetchUsers]);
	
	useEffect(() => {
		const handleScroll = () => {
			const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
			
			if (!loading && users.length < totalUsers && scrollTop + clientHeight >= scrollHeight - 10) {
				setPage((prevPage) => prevPage + 1);
			}
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [users.length, totalUsers, loading]);
	
	return (
		<div className={styles.container}>
			{loading ? (
				<p>Загрузка...</p>
			) : (
				<div className={styles.label}>
					<label>Users</label>
					<select className={styles.select}>
						{users.map((user) => (
							<option key={user.id}>
								{user.last_name.charAt(0)} {'\u00A0'}
								{`${user.last_name} ${user.first_name}, ${user.job}`}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};

export default UserSelect;
