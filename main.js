// Description: Project 5 for CIS 104
// Author: Arkadiusz Bregula (bregulaa@student.ncmich.edu)
// Version: 1.0.0

'use strict';

const PROMPT = require('readline-sync');

const START_GENRES = ['Classical', 'Easy Listening', 'Jazz', 'Pop', 'Rock', 'Other'];
const PRICE_GROUPS = [
	{min: 0, max: 2.99, name: 'Under $3.00'},
	{min: 3, max: 5.99, name: '$3.00 to $5.99'},
	{min: 6, max: 9.99, name: '$6.00 to $9.99'},
	{min: 10, max: 9999, name: 'Over $10.00'}
];
const MAIN_MENU = [
	{text: '0. Add Transaction', action: addTransaction},
	{text: '1. Show Report', action: showStandardReport},
	{text: '2. Show Report (sorted by the most downloaded genre)', action: showSortedReport},
	{text: '3. Exit', action: exit}
];

let transactions;
let genres;
let wantsToExit = false;

/**
 * The main dispatcher function.
 */
function main() {
	setTransactions();
	setGenres();

	while(!wantsToExit) {
		showMainMenu();
		setGenreTotals();
	}
}

/**
 * Shows the main menu for the program. Also executes the action chosen by the user.
 */
function showMainMenu() {
	console.log('What would you like to do today: ');
	for(let i = 0; i < MAIN_MENU.length; i++) {
		console.log(`\t${MAIN_MENU[i].text}`);
	}
	let menuSelection = PROMPT.questionInt('>> ');
	if(menuSelection >= 0 && menuSelection < MAIN_MENU.length) {
		MAIN_MENU[menuSelection].action();
	}
}

/**
 * Set the genres array based on the START_GENRES constant.
 */
function setGenres() {
	genres = new Array(START_GENRES.length);
	for(let i = 0; i < START_GENRES.length; i++) {
		genres[i] = { id: i, genre: START_GENRES[i], numOfTransactions: 0, totalSales: 0 };
	}
}

/**
 * Initialize transactions.
 */
function setTransactions() {
	transactions = [];
}

/**
 * Asks for the price and genre. If valid adds them to the transactions array.
 */
function addTransaction() {
	let price = askForPrice();
	let genre = askForGenre();

	transactions.push({ price, genre });
}

/**
 * Shows a report for all of the transactions already added based on the provided genre list.
 */
function showReport(genreList) {
	for(let i = 0; i < genreList.length; i++) {
		console.log(`----- ${genreList[i].genre} -----`);
		for(let x = 0; x < PRICE_GROUPS.length; x++) {
			let currPriceGroup = PRICE_GROUPS[x];
			let filteredTransactions = filterTransactions(x, genreList[i].id);
			console.log(`${currPriceGroup.name}:\t${filteredTransactions.length}`);
		}
		console.log('\n');
	}
}

/**
 * Show a report for all genres without sorting.
 */
function showStandardReport() {
	showReport(genres);
}

/**
 * Shows a report for all genres sorted by the total sales.
 */
function showSortedReport() {
	let sortedGenres = Array.from(genres);
	sortedGenres.sort((a, b) => {
		return a.totalSales < b.totalSales;
	});
	showReport(sortedGenres);
}

/**
 * @param  {Number} priceGroup The index of the price group to filter.
 * @param  {Number} genre The index of the genre to filter.
 * @return {Array} The filtered array.
 */
function filterTransactions(priceGroup, genre) {
	let result = transactions.filter((el) => {
		return el.price >= PRICE_GROUPS[priceGroup].min && el.price <= PRICE_GROUPS[priceGroup].max && el.genre === genre;
	});
	return result;
}

/**
 * Ask for the price and if valid return it.
 * @return {Number} The price.
 */
function askForPrice() {
	let price = PROMPT.questionFloat('Price ($x.xx): ');

	if(price >= 0) {
		return price;
	} else {
		console.log('Price must be positive!');
		return askForPrice();
	}
}

/**
 * Show the available genres, and ask for the genre id. If valid, return the genre index.
 * @return {Number} ID of the genre in the MUSIC_GENRES array. 
 */
function askForGenre() {
	console.log('Available genres: ');
	for(let i = 0; i < genres.length; i++) {
		console.log(`${i}. ${genres[i].genre}`);
	}

	let genre = PROMPT.questionInt('Genre: ');

	if(genre >= 0 && genre < genres.length) {
		return genre;
	} else {
		console.log('Please enter a valid genre.');
		return askForGenre();
	}
}

/**
 * Calculates the total sales and number of sales for each genre.
 */
function setGenreTotals() {
	for(let i = 0; i < transactions.length; i++) {
		genres[transactions[i].genre].totalSales += transactions[i].price;
		genres[transactions[i].genre].numOfTransactions += 1;
	}
}

/**
 * Sets wantsToExit to true, causing the program to exit.
 */
function exit() {
	wantsToExit = true;
}

main();
