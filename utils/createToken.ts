import {createHash} from "crypto"

export function createToken(data: object) {
	const sha = createHash("sha256")
	const arr: object[] = [{Password: process.env.TERMINAL_PASSWORD}]
	Object.entries(data).forEach(([key, value]) => {
		arr.push({
			[key]: value,
		})
	})

	sha.update(
		arr
			.sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]))
			.map((el) => Object.values(el)[0])
			.join(""),
		"utf8"
	)

	return sha.digest("hex")
}
