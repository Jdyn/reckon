import { ReactComponent as BackgroundComp } from './bg.svg'


const Background = () => {
	return (
		<div style={{
			position: 'absolute',
			inset: 0,
			display: 'flex',
			alignItems: 'stretch',
			justifyContent: 'center',
			zIndex: -1,
			verticalAlign: 'middle',
			overflow: 'visible',
		}}>
			<BackgroundComp width="max(2560px,100vw)" height="auto" />
		</div>
	);
}

export default Background;
