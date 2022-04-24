import { Router } from "next/router";
import np from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";

const delay = 250;

export function NProgress() {
	useEffect(() => {
		let timeoutId: number;

		const load = () => {
			// do not show progress bar if tranition takes less than 'delay' ms
			timeoutId = window.setTimeout(() => {
				np.start();
			}, delay);
		};

		const stop = () => {
			clearTimeout(timeoutId);
			np.done();
		};

		Router.events.on("routeChangeStart", load);
		Router.events.on("routeChangeComplete", stop);
		Router.events.on("routeChangeError", stop);

		return () => {
			Router.events.off("routeChangeStart", load);
			Router.events.off("routeChangeComplete", stop);
			Router.events.off("routeChangeError", stop);
			clearTimeout(timeoutId);
		};
	}, []);

	return null;
}
