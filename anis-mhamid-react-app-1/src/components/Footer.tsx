import {FunctionComponent, useState} from "react";
import {instagram, linkedin} from "../fontAwesome/Icons";
import {FormikValues, useFormik} from "formik";
import * as yup from "yup";
import {subscripeEmailForNews} from "../services/userServices";
import {Link} from "react-router-dom";

interface FooterProps {
	theme: any;
}

const Footer: FunctionComponent<FooterProps> = ({theme}) => {
	const [hoverState, setHoverState] = useState({
		email: false,
		linkedin: false,
		instagram: false,
	});

	// formik  schema validation
	const formik: FormikValues = useFormik<{email: string}>({
		initialValues: {
			email: "",
		},
		validationSchema: yup.object({
			email: yup
				.string()
				.email("Invalid email address")
				.required("Email is required"),
		}),
		onSubmit: (values, {resetForm}) => {
			subscripeEmailForNews(values.email)
				.then((res) => console.log(res.data))
				.catch((err) => {
					console.log(err);
				});
			resetForm();
		},
	});

	const handleMouseOver = (link: string) => {
		setHoverState((prev) => ({...prev, [link]: true}));
	};

	const handleMouseOut = (link: string) => {
		setHoverState((prev) => ({...prev, [link]: false}));
	};

	return (
		<footer
			style={{background: theme.background, color: theme.color}}
			className='text-center py-5 border-top border-info w-100'
			aria-labelledby='footer-contact'
		>
			<div className='container'>
				<h2 id='footer-contact' className='mt-4'>
					Contact Us
				</h2>
				<p className='lead'>
					Have questions or want to learn more? Feel free to reach out to us at
					<Link
						to='mailto:support@bcards.com'
						onMouseOver={() => handleMouseOver("email")}
						onMouseOut={() => handleMouseOut("email")}
						style={{
							color: hoverState.email ? "#d84f49" : "#3b31e3",
						}}
						className=' d-block fs-5 fw-bold text-decoration-none mb-5'
						aria-label='Send an email to bCards support'
					>
						anesmhamed1@gmail.com
					</Link>
				</p>
				{/* Form with Formik */}
				<form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
					<div className='form-group w-50 m-auto'>
						<input
							type='email'
							name='email'
							className='form-control'
							placeholder='Enter your email'
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.email && formik.errors.email && (
							<div className='text-danger'>{formik.errors.email}</div>
						)}
					</div>

					<button type='submit' className='btn btn-primary mt-3'>
						Subscribe
					</button>
				</form>
				<div className='social-links fs-1 mt-4'>
					<Link
						onMouseOver={() => handleMouseOver("linkedin")}
						onMouseOut={() => handleMouseOut("linkedin")}
						style={{
							color: hoverState.linkedin ? "#d84f49" : "#3b31e3",
						}}
						rel='nppener noreferrer'
						target='_blank'
						to='https://www.linkedin.com/in/anis-mhamid-2303a3b6/'
						className='mx-3'
						aria-label='Follow us on LinkedIn'
					>
						{linkedin}
					</Link>
					<Link
						onMouseOver={() => handleMouseOver("instagram")}
						onMouseOut={() => handleMouseOut("instagram")}
						style={{
							color: hoverState.instagram ? "#d84f49" : "#3b31e3",
						}}
						rel='nppener noreferrer'
						target='_blank'
						to='https://www.instagram.com/anesmhamed/?igsh=MXZ3ZXZjaHlvanV0ag%3D%3D#'
						className='mx-3'
						aria-label='Follow us on Instagram'
					>
						{instagram}
					</Link>
				</div>
				<p className='mt-4 pb-5'>&copy; 2024 bCards. All Rights Reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
