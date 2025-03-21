import {FunctionComponent, useContext, useEffect, useState} from "react";
import {User} from "../interfaces/User";
import {getUserProfileById, patchUserBusiness} from "../services/userServices";
import useToken from "../hooks/useToken";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {SiteTheme} from "../theme/theme";
import {useUserContext} from "../context/UserContext";

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
	const {decodedToken} = useToken();
	const {isBusiness, setIsBusiness} = useUserContext();
	const theme = useContext(SiteTheme);

	// Initialize userData as null since you're fetching a single user object
	const [userData, setUserData] = useState<User | null>(null);

	const handleBusiness = () => {
		patchUserBusiness(decodedToken._id, !isBusiness).then((res) =>
			setIsBusiness(isBusiness),
		);
	};

	useEffect(() => {
		getUserProfileById(decodedToken._id || "")
			.then((user) => setUserData(user.data))
			.catch((err) => console.log(err));
	}, [decodedToken._id]);

	return (
		<>
			<Navbar />
			{/* Check if userData is available and render the user data */}
			{userData ? (
				<div
					style={{background: theme.background, color: theme.color}}
					className='container'
				>
					<div className='row w-100'>
						<div className='col-md-12 col-lg-3'>
							<h6
								style={{backgroundColor: theme.background}}
								className='shadow text-center lead display-5 p-3 fw-bold my-3 rounded-end-pill'
							>
								Profile
							</h6>
						</div>
					</div>
					<div
						style={{background: theme.background, color: theme.color}}
						className='row my-5'
					>
						<div
							style={{background: theme.background, color: theme.color}}
							className='card col-md-12'
						>
							<div className='card-header rounded-3'>
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
								<h5
									onClick={handleBusiness}
									className='catd-text text-light p-2 rounded my-3 bg-dark w-50'
								>
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
