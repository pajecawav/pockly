import "next-auth";
import { ReactNode } from "react";

declare module "next-auth" {
	interface User {
		id: string;
	}

	interface Session {
		user: User;
	}
}

// https://github.com/civiccc/react-waypoint/issues/360
declare module "react-waypoint" {
	namespace Waypoint {
		interface WaypointProps {
			children?: ReactNode;
		}
	}
}
