import {FunctionComponent} from "react";

// props type for formik validation
interface UserInputFormikPropsType {
	name: string;
	type: string;
	value: string | number | undefined;
	error: string | undefined;
	touched: boolean | undefined;
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
};

const CardsInput: FunctionComponent<UserInputFormikPropsType> = (props) => {
	return (
		<div className='form-floating mb-2'>
			<input
				type={props.type}
				id={props.name}
				name={props.name}
				value={props.value}
				placeholder={props.placeholder}
				className={`form-control shadow w-100 my-1 ${
					props.touched && props.error ? "is-invalid" : ""
				}`}
				onChange={props.onChange}
				onBlur={props.onBlur}
				aria-label={props.name}
			/>
			{props.touched && props.error && (
				<div className='invalid-feedback'>{props.error}</div>
			)}
			<label htmlFor={props.name} className='form-label fw-bold text-secondary'>
				{props.placeholder}
			</label>
		</div>
	);
};

export default CardsInput;
