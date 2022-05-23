import { usePinnedTagsStore } from "@/stores/usePinnedTagsStore";
import { Box, BoxProps } from "@chakra-ui/react";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";

export function PinnedTags() {
	const { tags, setPinnedTags } = usePinnedTagsStore();

	const getDraggableProps = (isDragging: boolean): Partial<BoxProps> => {
		return isDragging
			? {
					bg: "gray.100",
					borderRadius: "md",
			  }
			: {};
	};

	const handleDragEnd = (result: DropResult) => {
		const from = result.source.index;
		const to = result.destination?.index;

		if (to === undefined || from === to) {
			return;
		}

		const [tag] = tags.splice(from, 1);
		tags.splice(to, 0, tag);

		setPinnedTags(tags);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="pinned-tags-droppable">
				{provided => (
					<SidebarSection
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{tags.map((tag, index) => (
							<Draggable
								draggableId={tag}
								index={index}
								key={tag}
							>
								{(provided, snapshot) => (
									<Box
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										{...getDraggableProps(
											snapshot.isDragging
										)}
									>
										<SidebarLink href={`/tags/${tag}`}>
											{tag}
										</SidebarLink>
									</Box>
								)}
							</Draggable>
						))}

						{provided.placeholder}
					</SidebarSection>
				)}
			</Droppable>
		</DragDropContext>
	);
}
