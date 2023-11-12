import PhaseOne from './PhaseOne';
import PhaseTwo from './PhaseTwo';
import PhaseZero from './PhaseZero';

interface ComposeDraftProps {
	phase: number;
	setPhase: React.Dispatch<React.SetStateAction<number>>;
}

const ComposeDraft = ({ phase, setPhase }: ComposeDraftProps) => {
	return (
		<>
			{phase === 0 && <PhaseZero setPhase={setPhase} />}
			{phase === 1 && <PhaseOne setPhase={setPhase} />}
			{phase === 2 && <PhaseTwo setPhase={setPhase} />}
		</>
	);
};

export default ComposeDraft;
