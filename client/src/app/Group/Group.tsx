import { useGroupBillsQuery } from "@reckon/core";
import { useParams } from "react-router";

const Group = () => {
	const { id } = useParams<{ id: string }>();
	const { data } = useGroupBillsQuery(id!, { skip: !id });
	return <div>Hello</div>;
};

export default Group;
