export function clearPhone(phone: string) {
	return phone.replace(/\+|\(|\)|\-/g, "")
}
