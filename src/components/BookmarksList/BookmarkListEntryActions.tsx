import { Icon, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import {
	HiOutlineAnnotation,
	HiOutlineArchive,
	HiOutlineHeart,
	HiOutlinePlus,
	HiOutlineTag,
	HiOutlineTrash,
} from "react-icons/hi";
import { FilledIcon } from "../FilledIcon";
import { Hotkey } from "../Hotkey";
import { Tooltip } from "../Tooltip";
import { TooltipLabel } from "../Tooltip/TooltipLabel";

interface Props {
	id: string;
	liked: boolean;
	archived: boolean;
	onToggleLiked: () => void;
	onToggleArchived: () => void;
	onEditTags: () => void;
	onDelete: () => void;
}

export function BookmarksListEntryActions({
	id,
	liked,
	archived,
	onToggleLiked,
	onToggleArchived,
	onEditTags,
	onDelete,
}: Props) {
	return (
		<>
			<Tooltip
				label={
					<TooltipLabel>
						Open notes &middot; <Hotkey value="N" />
					</TooltipLabel>
				}
			>
				<span>
					<NextLink href={`/b/${id}`} passHref>
						<Link display="block" lineHeight="0" data-hotkey="n">
							{/* TODO: better icon */}
							<Icon as={HiOutlineAnnotation} boxSize="6" />
						</Link>
					</NextLink>
				</span>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						Toggle like &middot; <Hotkey value="L" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={
						<FilledIcon
							as={HiOutlineHeart}
							boxSize="6"
							filled={liked}
						/>
					}
					lineHeight="0"
					aria-label="Toggle liked"
					data-hotkey="l"
					onClick={onToggleLiked}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						{archived ? "Add to reading list" : "Move to archive"}{" "}
						&middot; <Hotkey value="A" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={
						<Icon
							as={archived ? HiOutlinePlus : HiOutlineArchive}
							boxSize="6"
						/>
					}
					lineHeight="0"
					aria-label={
						archived ? "Add to reading list" : "Move to archive"
					}
					data-hotkey="a"
					onClick={onToggleArchived}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						Edit tags &middot; <Hotkey value="T" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={<Icon as={HiOutlineTag} boxSize="6" />}
					lineHeight="0"
					aria-label="Edit tags"
					data-hotkey="t"
					onClick={onEditTags}
				/>
			</Tooltip>

			<Tooltip
				label={
					<TooltipLabel>
						Delete &middot; <Hotkey value="D" />
					</TooltipLabel>
				}
			>
				<IconButton
					icon={<Icon as={HiOutlineTrash} boxSize="6" />}
					lineHeight="0"
					aria-label="Delete bookmark"
					data-hotkey="d"
					onClick={onDelete}
				/>
			</Tooltip>
		</>
	);
}
