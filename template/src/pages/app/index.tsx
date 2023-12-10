import { Head, Body, Async } from "@react-ion/ssr";

const Users = Async.create(api.users.get, ({ data, error, isLoading }) => 
{
	if (error)
	{
		console.error(error);
		return null;
	}

	if(isLoading)
	{
		return <h1>Loading...</h1>;
	}

	return (
		<>
			{data.map(({ id, first_name, last_name, gender, address }) => (
				<div key={id}>
					<span>id: {id}</span>
					<div>{first_name} {last_name} - {gender}</div>
					<div>{address.city} {address.street_address}</div>
					<hr />
				</div>
			))}
		</>
	);
});

export default () => (
	<html>
		<Head>
			<title>App</title>
		</Head>
		<Body>
			<Users prefetch count={20} />
		</Body>
	</html>
);
