export function usePlattformSpecific(value) {
	if (process.platform === "darwin") return value.mac ?? value.default;
	if (process.platform === "win32") return value.windows ?? value.default;
	if (process.platform === "linux") return value.linux ?? value.default;
	return value.default;
}