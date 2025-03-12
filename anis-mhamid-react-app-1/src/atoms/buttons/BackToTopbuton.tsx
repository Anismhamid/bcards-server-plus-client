import {FunctionComponent} from "react";
import { arrowCircleUp } from "../../fontAwesome/Icons";

interface BackToTopbutonProps {}

const BackToTopbuton: FunctionComponent<BackToTopbutonProps> = () => {
	const scrollToTop = () => {
		window.scrollTo({top: 0, behavior: "smooth"});
	};
	return (
		<button className='back-top sticky-bottom rounded-circle ratio' onClick={scrollToTop}>
			{arrowCircleUp}
		</button>
	);
};

export default BackToTopbuton;