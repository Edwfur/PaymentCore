import {createHash} from "crypto"

export function createToken(data: object) {
	const sha = createHash("sha256")
	const arr: object[] = [{Password: process.env.TERMINAL_PASSWORD}]
	Object.entries(data).forEach(([key, value]) => {
		arr.push({
			[key]: value,
		})
	})

	console.log("process.env.TERMINAL_ID", process.env.TERMINAL_ID)
	console.log("process.env.TERMINAL_PASSWORD", process.env.TERMINAL_PASSWORD)

	sha.update(
		arr
			.sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]))
			.map((el) => Object.values(el)[0])
			.join(""),
		"utf8"
	)

	return sha.digest("hex")
}
