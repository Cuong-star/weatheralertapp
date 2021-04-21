import * as data from "./citylist/vn-citylist.json";

function getCityList() {
	// let countryList = new Array();
	let products = (data as any).default;
	// for(let index of products)
	// {
	// 	countryList.push(index)
	// }
	return products;
}

export { getCityList }