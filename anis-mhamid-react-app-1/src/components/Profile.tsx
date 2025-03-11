import {FunctionComponent, useEffect, useState} from "react";
import {User} from "../interfaces/User";
import {getUserById} from "../services/userServices";
import useToken from "../hooks/useToken";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { theme } from "../theme/theme";

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
	const {decodedToken} = useToken();

	// Initialize userData as null since you're fetching a single user object
	const [userData, setUserData] = useState<User | null>(null);

	useEffect(() => {
		getUserById(decodedToken._id || "")
			.then((user) => setUserData(user.data))
			.catch((err) => console.log(err));
	}, [decodedToken._id]);

	return (
		<>
			<Navbar />
			{/* Check if userData is available and render the user data */}
			{userData ? (
				<div className='container'>
					<div className='row my-5'>
						<div className='card col-md-12'>
							<div className='card-header bg-body-secondary rounded-3'>
								<div className='card-title'>
									First name:
									<span className='text-success ms-1 me-5 fw-bolder'>
										{userData?.name?.first}
									</span>
								</div>
								<div className='card-subtitle mb-2'>
									Middle name:
									<span className='text-success ms-1 me-5 fw-bolder'>
										{userData.name?.middle}
									</span>
								</div>
								<div className='card-subtitle'>
									Last name:
									<span className='text-success ms-1 me-5 fw-bolder'>
										{userData.name?.last}
									</span>
								</div>
							</div>
							<div className='card-body'>
								<div className='card-img w-50 rounded-5'>
									<img
										style={{
											height: "250px",
										}}
										className='img-fluid rounded-5 image-shadow'
										src={userData.image?.url}
										alt={userData.image?.alt}
									/>
								</div>
								<h5 className='catd-text text-light p-2 rounded my-3 bg-dark w-50'>
									User role:
									<span
										className={`${
											userData.isAdmin
												? "text-success"
												: "text-info"
										} lead ms-2`}
									>
										{userData.isAdmin ? "Admin" : "User"}
									</span>
								</h5>
								<h5 className='catd-text text-light p-2 rounded my-3 bg-dark w-50'>
									Account role:
									<span
										className={`${
											userData.isBusiness
												? "text-primary"
												: "text-info"
										} lead ms-2`}
									>
										{userData.isBusiness ? "Business" : "Client"}
									</span>
								</h5>
							</div>
						</div>
					</div>
				</div>
			) : (
				<p>Loading user data...</p> // Show loading state if userData is still null
			)}
			<Footer theme={theme} />;
		</>
	);
};

export default Profile;
