import {FunctionComponent, useContext} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {SiteTheme} from "../../theme/theme";
import {leftArrow, rightArrow} from "../../fontAwesome/Icons";
import useCards from "../../hooks/useCards";
import {Cards} from "../../interfaces/Cards";
import { infoMSG} from "../taosyify/Toastify";

interface NextCardButtonProps {}

const NextCardButton: FunctionComponent<NextCardButtonProps> = () => {
	const navigate = useNavigate();
	const {cardId} = useParams<string>();
	const theme = useContext(SiteTheme);
	const {allCards} = useCards();

	const currentCardIndex = allCards.findIndex((card: Cards) => card._id === cardId);

	const nextCard = allCards[currentCardIndex + 1];
	const backCard = allCards[currentCardIndex - 1];

	// Handle navigation to next or previous card
	const handleNextCardNavigation = (nextCardId: string) => {
		navigate(`/cardDetails/${nextCardId}`);
	};

	return (
		<div className='d-flex justify-content-around mb-5'>
			{/* Back button */}
			<button
				style={{backgroundColor: theme.background, color: theme.color}}
				className='bg-transparent border-0'
				onClick={() => {
					if (backCard) {
						handleNextCardNavigation(backCard._id as string);
					} else {
						infoMSG("This is the first card.");
					}
				}}
				disabled={!backCard}
			>
				<span className='fs-4 next-back-home'>{leftArrow} Back</span>
			</button>

			{/* Next button */}
			<button
				style={{backgroundColor: theme.background, color: theme.color}}
				className='bg-transparent border-0'
				onClick={() => {
					if (nextCard) {
						handleNextCardNavigation(nextCard._id as string);
					} else {
						infoMSG("This is the last card.");
					}
				}}
				disabled={!nextCard}
			>
				<span className='fs-4 next-back-home'>Next {rightArrow}</span>
			</button>
		</div>
	);
};

export default NextCardButton;
