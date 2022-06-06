import { bookmarkUrlSchema } from "@/lib/schemas";
import {
	ShareTargetMutation,
	ShareTargetMutationVariables,
} from "@/__generated__/operations";
import { useMutation } from "@apollo/client";
import { Center, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect } from "react";

const urlSchema = bookmarkUrlSchema;

export default function ShareTargetPage() {
	const toast = useToast();
	const router = useRouter();

	const [createBookmark] = useMutation<
		ShareTargetMutation,
		ShareTargetMutationVariables
	>(
		gql`
			mutation ShareTargetMutation($input: CreateBookmarkInput!) {
				createBookmark(input: $input) {
					id
				}
			}
		`,
		{
			onCompleted: ({ createBookmark: { id } }) => handleSuccess(id),
			onError: () => handleError(),
		}
	);

	const handleSuccess = (id: string) => {
		toast({
			status: "success",
			description: "Saved bookmark!",
		});
		router.replace(`/b/${id}`);
	};

	const handleError = useCallback(() => {
		toast({
			status: "error",
			description: "Failed to save bookmark!",
		});
		router.replace("/read");
	}, [router, toast]);

	useEffect(() => {
		if (!router.isReady) {
			return;
		}

		const query = router.query;

		let url: string | null = null;
		if (urlSchema.safeParse(query.text).success) {
			url = query.text as string;
		} else if (urlSchema.safeParse(query.url).success) {
			url = query.url as string;
		}

		if (url) {
			createBookmark({ variables: { input: { url } } });
		} else {
			handleError();
		}
	}, [router, createBookmark, handleError]);

	return (
		<Center w="full">
			<VStack>
				<Spinner size="lg" />
				<Text>Saving bookmark...</Text>
			</VStack>
		</Center>
	);
}

ShareTargetPage.AppShell = Fragment;
