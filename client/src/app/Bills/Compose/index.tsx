import { useSearchParams } from 'react-router-dom';

import styles from './Compose.module.css';
import ComposeItem, { BillForm } from './ComposeItem';
import { useCompose } from './ComposeProvider';

const Compose = () => {
	const { composeState } = useCompose();

	return (
		<div className={styles.root}>
			{Object.keys(composeState).map((itemKey) => (
				<ComposeItem
					key={itemKey}
					itemKey={itemKey}
					defaultValues={composeState[itemKey] as Partial<BillForm>}
				/>
			))}
		</div>
	);
};

export default Compose;
