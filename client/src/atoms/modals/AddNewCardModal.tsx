import {FunctionComponent} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AddNewCardForm from "./AddNewCardForm";

interface AddNewCardModalProps {
	show: boolean;
	onHide: Function;
	refresh: Function;
}

const AddNewCardModal: FunctionComponent<AddNewCardModalProps> = ({
	onHide,
	show,
	refresh,
}) => {
	return (
		<>
			<Modal
				className='modal'
				show={show}
				size='lg'
				onHide={() => onHide()}
				backdrop='static'
				keyboard={true}
				data-bs-theme='danger'
				centered
				scrollable
			>
				<Modal.Header
					style={{background: "#ECF8F8"}}
					className=" shadow"
					closeButton
					aria-label='create new card'
				>
					<Modal.Title className='text-danger bg-light p-1 rounded border border-danger'>
						<span className='fs-6'>
							On pc
							<span className='mx-1 border border-2 rounded p-1 fw-bold'>
								Esc
							</span>
							to exit
						</span>
					</Modal.Title>
					<Modal.Dialog className='text-light display-6 shadow rounded'>
						<span className='p-2 text-success fw-bold'>Add CARD</span>
					</Modal.Dialog>
				</Modal.Header>
				<Modal.Body>
					<AddNewCardForm refresh={() => refresh()} />
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant='danger'
						className='text-uppercase fw-bold'
						onClick={() => onHide()}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AddNewCardModal;
