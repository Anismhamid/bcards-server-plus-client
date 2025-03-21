import {
	FunctionComponent,
	SetStateAction,
	useCallback,
	useContext,
	useState,
} from "react";
import useCards from "../hooks/useCards";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Cards} from "../interfaces/Cards";
import {useUserContext} from "../context/UserContext";
import {SiteTheme} from "../theme/theme";
import DeleteModal from "../atoms/modals/DeleteModal";
import UpdateCardForm from "./UpdateCardForm";
import useToken from "../hooks/useToken";
import {handleDeleteCard_Cards, handleLikeToggle_Cards} from "../handleFunctions/cards";
import Loading from "./Loading";
import Button from "../atoms/buttons/Button";
import NextCardButton from "../atoms/buttons/NextCardButton";
import {heart} from "../fontAwesome/Icons";
import {pathes} from "../routes/Routes";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DynamicMap from "./DynamicMap";

interface CardDetailsProps {}

const CardDetails: FunctionComponent<CardDetailsProps> = () => {
	const onHideDeleteCardModal = useCallback(() => setShowDeleteModal(false), []);
	const onShowDeleteCardModal = useCallback(() => setShowDeleteModal(true), []);
	const [cardToDelete, setCardToDelete] = useState<SetStateAction<string>>("");
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const {isAdmin, isLogedIn} = useUserContext();
	const {allCards, setCards} = useCards();
	const {cardId} = useParams<string>();
	const theme = useContext(SiteTheme);
	const navigate = useNavigate();
	const {decodedToken} = useToken();
	const card = allCards?.find((card: Cards) => card._id === cardId);
	const [refreshing, setRefreshing] = useState(false);

	const refresh = () => {
		setRefreshing(!refreshing);
	};

	if (!card) return <Loading />;

	return (
		<>
			<Navbar />
			<main style={{backgroundColor: theme.background, color: theme.color}}>
				<div className='row w-100'>
					<div className='col-md-12 col-lg-3'>
						<h6
							style={{backgroundColor: theme.background}}
							className='shadow text-center lead display-5 p-3 fw-bold my-3  rounded-end-pill'
						>
							Card Details
						</h6>
					</div>
				</div>
				<div className='p-3'>
					<Button text='Home' path={() => navigate(pathes.cards)} />
				</div>
				<div className='card-details-image'>
					<img
						style={{
							height: "300px",
						}}
						className='img-fluid'
						src={card.image.url}
						alt={card.image.alt}
					/>
				</div>

				<NextCardButton />
				<div
					className='m-auto	custom-border rounded-3 card shadow overflow-hidden my-5 w-75 p-3'
					style={{
						backgroundColor: theme.background,
						color: theme.color,
					}}
				>
					<div className='card-body'>
						<h5 className='card-title text-center'>{card.title}</h5>
						<h6 className='card-subtitle text-center mb-2 text-secondary'>
							{card.subtitle}
						</h6>
						<hr className='w-50 m-auto' />
						<div className='container w-25 d-flex align-items-center justify-content-center'>
							<p
								onClick={() =>
									handleLikeToggle_Cards(
										card._id as string,
										allCards,
										decodedToken._id,
										setCards,
									)
								}
								className={`${
									card.likes?.includes(decodedToken?._id)
										? "text-danger"
										: ""
								} fs-2 text-center`}
							>
								{heart}
							</p>
							<p
								className={`${
									card.likes?.includes(decodedToken?._id)
										? "text-danger"
										: ""
								} mx-1 text-center`}
							>
								Likes
							</p>
							<p
								className={`${
									card.likes?.includes(decodedToken?._id)
										? "text-danger"
										: ""
								} mx-1 fs-5 text-center`}
							>
								{card.likes?.length}
							</p>
						</div>
						<div className='row'>
							<div className='col-12'>
								<div className='card-text mt-5'>
									<h2>
										Call us at :
										<Link
											className='ms-2'
											to={`tel:+972${card.phone.slice(1)}`}
										>
											{card.phone}
										</Link>
									</h2>
									<hr className='w-25 border-danger' />
									<h2>
										Ower address : {card.address.city},
										{card.address.street}
									</h2>
									<hr className='w-25 border-danger' />
								</div>

								<div className='card-text'>
									<h2 className=' text-success'>description</h2>
									<hr />
									<p
										style={{whiteSpace: "pre-line"}}
										className='lead lh-base text-primary rounded'
									>
										{card.description}
									</p>
								</div>
							</div>
							<div className='w-100'>
								{((isLogedIn && isAdmin) ||
									(isLogedIn && card.user_id === decodedToken._id)) && (
									<button
										onClick={() => {
											onShowDeleteCardModal();
											setCardToDelete(card._id as string);
										}}
										className='btn btn-danger w-50 my-5'
									>
										Delete
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				<DynamicMap address={`${card.address.city}, ${card.address.street}`} />
				<div className='container-sm'>
					{isAdmin || (isLogedIn && card.user_id === decodedToken._id) ? (
						<>
							<hr className=' mb-4' />
							<h6 className=' display-6 mx-3'>Edit Card</h6>
							<UpdateCardForm refresh={() => {}} />
						</>
					) : null}
				</div>
				<DeleteModal
					render={refresh}
					method='Delete Card'
					toDelete='Are you sure you want to Delete This Card? this card will be permanently removed. This action cannot be undone.'
					show={showDeleteModal}
					onHide={onHideDeleteCardModal}
					onDelete={() => {
						handleDeleteCard_Cards(
							cardToDelete as string,
							setCards((prev) =>
								prev.filter((c) => c._id !== cardToDelete),
							),
						);
					}}
					navigateTo={-1}
				/>
			</main>
			<Footer theme={theme} />;
		</>
	);
};

export default CardDetails;
