export interface Cards {
	_id?: string;
	title: string;
	subtitle: string;
	description: string;
	phone: string;
	email: string;
	web?: string;
	image: {
		url: string;
		alt: string;
	};
	address: {
		state?: string;
		country: string;
		city: string;
		street: string;
		houseNumber: number;
		zip?: string;
	};
	bizNumber?: number;
	likes?: string[];
	user_id?: string;
	createdAt?: string;
	__v?: number;
}
