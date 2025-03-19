import {FunctionComponent} from "react";

interface CheckboxProps {
	role:string;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({role}) => {
	return (
		<label className='materialCheckbox'>
			<input type='checkbox' />
			<span className='checkmark p-2'></span>
			{role}
		</label>
	);
};
export default Checkbox;
