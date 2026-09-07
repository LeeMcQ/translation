import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-api-B3XCw-cK.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getEngines = createServerFn({ method: "GET" }).handler(createSsrRpc("45fb81463d7a7ce2ac946072603cb6299cdc536daf97d43262cd0f1f25834534"));
var createService = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f307d52ead2ddb6d4fe4d3edcde98e066c2f0124653c097e891dcaa4fcf832b9"));
var getServiceByCode = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("c40144a76a374c7f971cc7fcf83d745d21f8e5a98e1aa020842b2faa8135e4a9"));
var pollService = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("8984124105db8cf049c10b586fb117902762df0186b756cbab4a59591fc74d75"));
var previewUtterance = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4afd15f91fcec2384d39a373c817b67a4a8d8559e8261be9c5a5bf7b6a01b006"));
var publishUtterance = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6f61485a39277b846c83068dadc950c2ba7363f50ee1a239aac22c63121f0f87"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("351cecb55e3b200de4c3820121748c69d04687e3915e26c5720f51626e4db873"));
var endService = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("fd715ce611ddfa7c1ad14af42d9e4cc4865d4c18888ccbd137c213cf307e0849"));
//#endregion
export { pollService as a, getServiceByCode as i, endService as n, previewUtterance as o, getEngines as r, publishUtterance as s, createService as t };
