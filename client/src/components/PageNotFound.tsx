import {FunctionComponent, useContext} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {SiteTheme} from "../theme/theme";

interface PageNotFoundProps {}

const PageNotFound: FunctionComponent<PageNotFoundProps> = () => {
	const navigate = useNavigate();
	const theme = useContext(SiteTheme);

	return (
		<>
			<Navbar />
			<main>
				<div
					style={{background: theme.background, color: theme.color}}
					className='d-flex justify-content-center align-items-center vh-100 bg-light'
				>
					<div className='text-center'>
						{/* Main Heading */}
						<h1 className='display-1 text-danger fw-bold'>404</h1>
						<h1 className='display-2 text-danger'>Oops! Page Not Found</h1>

						{/* Description */}
						<p className='lead text-muted'>
							The page you're looking for might have been moved or doesn't
							exist.
						</p>

						{/* Navigation Links */}
						<div className='mt-4'>
							<button
								onClick={() => navigate(-1)}
								className='btn btn-dark mx-5 btn-lg mr-3'
							>
								Back One Step
							</button>
							<button
								onClick={() => navigate("/")}
								className='btn btn-dark btn-lg'
							>
								Go Back To Home
							</button>
						</div>
					</div>
				</div>
			</main>
			<Footer theme={theme} />;
		</>
	);
};

export default PageNotFound;
