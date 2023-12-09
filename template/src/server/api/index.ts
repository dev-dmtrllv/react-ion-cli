import { Api } from "@react-ion/ssr/server";

class Users extends Api
{
	override async get({ count = 10 }: { count?: string | number }): Promise<User[]>
	{
		const response = await fetch(`https://random-data-api.com/api/users/random_user?size=${count}`).then(r => r.json());
		if(response.error)
			throw new Error(response.error);
		return response;
	}
}

export default {
	users: Users,
};

type User = {
	id: number;
	uid: string;
	password: string;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	avatar: string;
	gender: string;
	phone_number: string;
	social_insurance_number: string;
	date_of_birth: Date;
	employment: Employment;
	address: Address;
	credit_card: CreditCard;
	subscription: Subscription;
}

type Address = {
	city: string;
	street_name: string;
	street_address: string;
	zip_code: string;
	state: string;
	country: string;
	coordinates: Coordinates;
}

type Coordinates = {
	lat: number;
	lng: number;
}

type CreditCard = {
	cc_number: string;
}

type Employment = {
	title: string;
	key_skill: string;
}

type Subscription = {
	plan: string;
	status: string;
	payment_method: string;
	term: string;
}
