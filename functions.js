var psCounter=0;
var stock;
var exchanges;
var exchangesName;
var stockName;
//Used to get value from dropdown box
$(document).ready(function () {
	// add event listener for change on exchange dropdown
	$('#exchange').change(function () {
		exchanges = $('#exchange').val();
		exchangesName = $(this).find("option:selected").text();
		$("#stocks").html("");
		if (exchanges !== "") {
			// debugging
			// alert(exchanges);
			StockAll(exchanges);
		}
	});
	$('#stocks').change(function(){
		stockName = $(this).find("option:selected").text();
	});

	$('#detailBtn').click(function () {
		$("#stockD").html("");
		$("#stockN").html("");
		stock = $('#stocks').val();
		var result = getStartDay();
		stockPrice(result,stockName);
	});
	$('#newsBtn').click(function () {
		$("#stockD").html("");
		$("#stockN").html("");
		stock = $('#stocks').val();
		//var result = getStartDay();
		newsDetail(stock);
	});
});
// Get data and print stock detail
function StockAll(exchange) {
	a = $.ajax({
		url: 'https://api.polygon.io/v3/reference/tickers?exchange=' + exchange + '&limit=100&apiKey=ot7olxzc3zhHpl0ttBurjWbzmLXvZGvm',
		method: "GET"
	}).done(function (data) {
		//psCounter++;
		//clear out old data
		$("#stocks").html("");
		len = data.results.length;
		for (i = 0; i < len; i++) {
			$("#stocks").append("<option value=" + data.results[i].ticker + ">" + data.results[i].name + "</option>");
		}
	}).fail(function (error) {
		console.log("error", error.statusText);
		$("#log").prepend("ps error " + new Date() + "<br>");
	});
}
//Use to get the data of stock price
function stockPrice(result,stockName) {
	a = $.ajax({
		url: 'https://api.polygon.io/v2/aggs/ticker/' + stock + '/range/1/day/' +result[6]+ '/' +result[0]+'?adjusted=&apiKey=ot7olxzc3zhHpl0ttBurjWbzmLXvZGvm',
		method: "GET"
	}).done(function (data) {
		//$("#stockD").append("");
		if(data.results !== undefined){
		len = data.results.length;
		var closeChange = data.results[len-1].c - data.results[len-2].c;
		$("#stockD").append( '<div class ="container border border-primary" id="stockDt">' +'<div class="row">' + 
		'<p class="text-first fs-1">' + stock +'<span class="fs-4"> · ' + stockName+ '</span></p><p class="fs-4">'+ exchangesName.toUpperCase()+'</p></div>')
		if(closeChange > 0){
				$("#stockDt").append(
			'<div class="row">'+ 
			'<p class="text-first fs-3"> Lastest close value: <span id ="winT">$' + data.results[len-1].c + '( + ' + closeChange.toFixed(2) + ')</span></p>' +
			'</div><br>'
			)}else{
					$("#stockDt").append(
				'<div class="row">'+ 
				'<h3 class="text-first fs-3"> At close: <span id ="loseT">$' + data.results[6].c + '('  + closeChange.toFixed(2) + ')</span>' +
				'</div><br>'
				)
			}
		for (i = 0; i < len; i++) {
		$("#stockDt").append(
		'<hr><div class="row"><div class="col-lg-2 mx-auto"><p class="fs-5  text-center">Date: ' + result[i] + '</p></div>'+
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5" >Vol: ' + (data.results[i].v/1000000).toFixed(2) + 'M' + '</p></div>' + 
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5">Open: ' + data.results[i].o.toFixed(2) + '</p></div>' + 
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5">High: ' + data.results[i].h.toFixed(2) + '</p></div>' + 
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5">Low: ' + data.results[i].l.toFixed(2) + '</p></div>' + 
		'</div><br>' 
		  );
		}
		const stockObject = {
			exchangeName: exchangesName,
			stockName: stockName,
			stockticker: stock,
			callType: "detail",
			stockData: data,
			Dates: result
		};
		var objectStr = JSON.stringify(stockObject);
		phpDetail(stock,stockObject.callType,objectStr);
	}else{
		alert("Stock price no available")
	}}).fail(function (error) {
		console.log("error", error.statusText);
		$("#log").prepend("ps error " + new Date() + "<br>");
	});
}

//Use to get data of stock's news 
function newsDetail(stock) {
	a = $.ajax({
		url: 'https://api.polygon.io/v2/reference/news?ticker=' + stock + '&order=desc&limit=5&sort=published_utc&apiKey=ot7olxzc3zhHpl0ttBurjWbzmLXvZGvm',
		method: "GET"
	}).done(function (data) {
		//psCounter++;
		//clear out old data
		len = data.results.length;
		//$("#stockN").append('<div class ="container border border-primary" id="stockNt">');
		$("#stockN").append('<div class="row">'+ 
		'<p class="text-first fs-3"> There is the Top <span>' + len +  ' News about '+ stockName+'</span></p>' +
		'</div><br><div class="row">')
		for (i = 0; i < len; i++) {
			var image_url = data.results[i].image_url;
			var timeFormat = formatUTC(data.results[i].published_utc);
			description = data.results[i].description;
			if(image_url === undefined || image_url.substring(image_url.length - 5) === ".html"){
				image_url = "https://suitabletech.com/images/HelpCenter/errors/Lenovo-Camera-Error.JPG";
			}
			if(description === undefined ){ 
				description = "None";
			}
			else if(description.length > 150){
			description = description.substring(0, 150);
			description += "...";
			}
			
		$("#stockN").append(
			'<div class="col-lg-4 align-self-center"><div class="card" style="width: 18rem;">'+
			'<img src="'+ image_url+'" class="card-img-top" alt"image of article"></img>' +
			'<div calss="card-body">'+
			'<h5 class="card-title">' + data.results[i].title + '</h5>' +
			'<pclass="card-text">Date: ' + timeFormat + '</p>'+
			'<p class="card-text">Author: ' + data.results[i].author + '</p>' +  
			'<p class="card-text">' + description + '</p>' + 
			'<a href="'+data.results[i].article_url+ '"class="btn btn-primary">'+'View'+ '</a>' +
			'</div></div></div>' 
		);
		}
		$("#stockN").append('</div>')
		const stockObject = {
			exchangeName: exchangesName,
			stockName: stockName,
			newsticker: stock,
			callType: "news",
			newsData: data
		};
		var objectStr = JSON.stringify(stockObject);
		phpDetail(stock,stockObject.callType,objectStr);
	}).fail(function (error) {
		console.log("error", error.statusText);
		$("#log").prepend("ps error " + new Date() + "<br>");
	});
}
//returns an array containing the 7 dates (excluding weekends) that are 9 days before the current date in the format yyyy-mm-dd:
function getStartDay() {
	var weekdays = [];
	var weekday = [];
	var currentDate = new Date();
	var weekdate;
	var weekdaysCounter = 0;
	while (weekdaysCounter < 9) {
		currentDate = new Date(currentDate.getTime() - (1 * 60 * 60 * 24 * 1000)); // move back one day
		if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // check if it's not a weekend day
			weekdays.push(currentDate);
			weekdaysCounter++;
		}
	}
	for (var i = 0; i <= weekdays.length - 1; i++) {
		var date = weekdays[i];
		var year = date.getFullYear();
		var month = String(date.getMonth() + 1).padStart(2, '0');
		var day = String(date.getDate()).padStart(2, '0');
		weekdate = year + '-' + month + '-' + day;
		weekday.push(weekdate);
	}
	return weekday;
}
/**
 * 
 * @param {*} timeUTC Time
 * @returns correct time format in yyyy-mm-dd hh:mm:ss
 */
function formatUTC(timeUTC){
	var date = new Date(timeUTC);

    // Get the year, month, day, hours, minutes, and seconds from the Date object
    var year = date.getUTCFullYear();
    var month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    var day = ("0" + date.getUTCDate()).slice(-2);
    var hours = ("0" + date.getUTCHours()).slice(-2);
    var minutes = ("0" + date.getUTCMinutes()).slice(-2);
    var seconds = ("0" + date.getUTCSeconds()).slice(-2);
	var formattedTimeUTC = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	return formattedTimeUTC;
}
//Store data into "setStock" table
function phpDetail(stock,tickerType,stockData){
	a = $.ajax({
method: "POST",
url: "final.php",
data: {method: "setStock", stockTicker: stock, queryType: tickerType, jsonData: stockData}}).done(
).fail(function (error) {
	console.log("error", error.statusText);
	$("#log").prepend("ps error " + new Date() + "<br>");
}
);
}