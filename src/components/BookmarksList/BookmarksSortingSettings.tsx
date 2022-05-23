import {
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import {
	HiOutlineSortAscending,
	HiOutlineSortDescending,
} from "react-icons/hi";

interface Props {
	oldestFirst: boolean;
	onChangeOldestFirst: (value: boolean) => void;
}

export function BookmarkSortingSettings({
	oldestFirst,
	onChangeOldestFirst,
}: Props) {
	return (
		<Menu autoSelect={false} placement="bottom-start">
			<MenuButton
				as={IconButton}
				variant="ghost"
				size="sm"
				icon={
					<Icon
						as={
							oldestFirst
								? HiOutlineSortDescending
								: HiOutlineSortAscending
						}
						boxSize="6"
					/>
				}
				aria-label="Sort order"
			/>
			<MenuList w="10">
				<MenuItem
					icon={<HiOutlineSortDescending size="1.5em" />}
					onClick={() => onChangeOldestFirst(true)}
				>
					Oldest First
				</MenuItem>
				<MenuItem
					icon={<HiOutlineSortAscending size="1.5em" />}
					onClick={() => onChangeOldestFirst(false)}
				>
					Newest First
				</MenuItem>
			</MenuList>
		</Menu>
	);
}
