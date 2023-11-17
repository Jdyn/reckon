import styles from './Compose.module.css';
import ComposeItem from './ComposeItem';
import { useCompose } from './ComposeProvider';

const Compose = () => {
	const { compose } = useCompose();

	return (
		<div className={styles.root}>
			{Object.keys(compose.state).map((key) => (
				<ComposeItem
				key={key}
				itemKey={key}
				defaultValues={compose.show(key)}
			/>
			))}
		</div>
	);
};

export default Compose;
