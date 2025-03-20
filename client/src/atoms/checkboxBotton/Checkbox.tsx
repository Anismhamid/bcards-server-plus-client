import {FunctionComponent} from "react";
import style from "./checkBox.module.css";

interface CheckboxProps {
	role: boolean;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({role}) => {
	return (
		<label className={style.label}>
			<input disabled readOnly className={style.sandBoxAdminInput} checked={role} type='checkbox' />
			<span className={style.checkbox}></span>
		</label>
	);
};
export default Checkbox;
