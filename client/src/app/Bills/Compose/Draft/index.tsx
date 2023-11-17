import PhaseOne from './PhaseOne';
import PhaseTwo from './PhaseTwo';
import PhaseZero from './PhaseZero';

interface ComposeDraftProps {
	phase: number;
}

const ComposeDraft = ({ phase }: ComposeDraftProps) => {
	return (
		<>
			{phase === 0 && <PhaseZero />}
			{phase === 1 && <PhaseOne />}
			{phase === 2 && <PhaseTwo />}
		</>
	);
};

export default ComposeDraft;
