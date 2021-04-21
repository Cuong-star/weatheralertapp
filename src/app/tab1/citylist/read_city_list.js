// this file have to nodejs to compile and run

let fs = require("fs");
let express = require("express");
let app= express();
let filename = 'weather_14.json';

let jsonFile = fs.readFileSync(filename);
let data= JSON.parse(jsonFile);


let countryKey = "VN";
function getCityList(country=countryKey)
{
	let list = new Array();
	for(let index of data)
	{
		let left = index.country.toLowerCase();
		let right = country.toLowerCase();
		if(left === right) {
			list.push(index);
		}
	}
	return list;
}

function getCityList_weather14(country=countryKey)
{
	let list = new Array();
	for(let index of data)
	{
		let left = index.city.country.toLowerCase();
		let right = country.toLowerCase();
		if(left === right) {
			list.push(index);
		}
	}
	return list;
}

// let cityList = getCityList();
let cityList_weather14 = getCityList_weather14();

data = JSON.stringify(cityList_weather14);
let fileName = `${countryKey.toLowerCase()}-citylist-weather14.json`;
fs.writeFileSync(fileName,data)
	