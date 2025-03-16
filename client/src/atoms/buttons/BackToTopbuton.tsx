import {FunctionComponent} from "react";
import {arrowCircleUp} from "../../fontAwesome/Icons";

interface BackToTopbutonProps {}

const BackToTopbuton: FunctionComponent<BackToTopbutonProps> = () => {
	const scrollToTop = () => {
		window.scrollTo({top: 100, behavior: "smooth"});
	};
	return (
		<div className='back-top-parrent'>
			<button
				className='back-top sticky-bottom rounded-circle ratio'
				onClick={scrollToTop}
			>
				{arrowCircleUp}
			</button>
		</div>
	);
};

export default BackToTopbuton;
