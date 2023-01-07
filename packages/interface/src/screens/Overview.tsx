import { useGetAccountQuery } from '@reckon/client';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

const HomeScreen = () => {
	const { data, error } = useGetAccountQuery();

	return <div>Home screen</div>;
};

export default HomeScreen;
