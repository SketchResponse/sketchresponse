export default function deepCopy(serializableObj) {
	return JSON.parse(JSON.stringify(serializableObj));
}
