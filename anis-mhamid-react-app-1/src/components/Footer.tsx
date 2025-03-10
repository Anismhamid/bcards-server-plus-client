import {FunctionComponent} from "react";
import {Link} from "react-router-dom";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
	return (
		<footer className='text-center pb-5 border-top border-info w-100'>
			<h2 className='mt-5'>Contact Us</h2>
			<p className=' lead'>
				Have questions or want to learn more? Feel free to reach out to us at
			</p>
			<Link to='mailto:support@bcards.com' className='text-primary'>
				anesmhamed1@gmail.com
			</Link>
			<p className=' pb-5'>&copy; 2024 bCards. All Rights Reserved.</p>
		</footer>
	);
};

export default Footer;
