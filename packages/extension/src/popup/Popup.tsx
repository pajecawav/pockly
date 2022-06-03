export function App() {
	function openOptionsPage() {
		browser.runtime.openOptionsPage();
	}

	return (
		<main>
			<div>pockly</div>
			<button onClick={openOptionsPage}>Open Options</button>
		</main>
	);
}
