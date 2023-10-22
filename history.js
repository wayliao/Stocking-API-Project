var historyDate;
var maxEntry;
$(document).ready(function () {
    // add event listener for change on exchange dropdown
    $('#datePicker').change(function () {
        historyDate = $('#datePicker').val();
    });
    $('#numberBox').change(function () {
        maxEntry = $('#numberBox').val();
    });
    $('#SearchBtn').click(function () {
        phpGet(historyDate);
    });
});
// display data when data is about stock news
function newsH(formatJSON){
    $("#historyDisplay").html("");
    $("#historyDisplay").append('<div class="row">'+ 
    '<p class="text-first fs-3"> There is the Top <span>' + formatJSON.newsData.results.length +  ' News about '+ formatJSON.stockName+'</span></p>' +
    '</div><br><div class="row">')
    for (i = 0; i < len; i++) {
        var image_url = formatJSON.newsData.results[i].image_url;
        var timeFormat = formatUTC(formatJSON.newsData.results[i].published_utc);
        description = formatJSON.newsData.results[i].description;
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
    $("#historyDisplay").append(
        '<div class="col-lg-4 align-self-center"><div class="card" style="width: 18rem;">'+
        '<img src="'+ image_url+'" class="card-img-top" alt"image of article"></img>' +
        '<div calss="card-body">'+
        '<h5 class="card-title">' + formatJSON.newsData.results[i].title + '</h5>' +
        '<pclass="card-text">Date: ' + timeFormat + '</p>'+
        '<p class="card-text">Author: ' + formatJSON.newsData.results[i].author + '</p>' +  
        '<p class="card-text">' + description + '</p>' + 
        '<a href="'+formatJSON.newsData.results[i].article_url+ '"class="btn btn-primary">'+'View'+ '</a>' +
        '</div></div></div>' 
    );
    }
    $("#historyDisplay").append('</div>')
}
// display data when data is about stock price
function stockH(formatJSON){
    $("#historyDisplay").html("");
    if(formatJSON.stockData.results !== undefined){
        len = formatJSON.stockData.results.length;
    var closeChange = formatJSON.stockData.results[len-1].c - formatJSON.stockData.results[len-2].c;
    $("#historyDisplay").append( '<div class ="container border border-primary" id="stockDt">' +'<div class="row">' + 
    '<p class="text-first fs-1">' + formatJSON.stockticker +'<span class="fs-4"> · ' + formatJSON.stockName+ '</span></p><p class="fs-4">'+ formatJSON.exchangeName.toUpperCase()+'</p></div>')
    if(closeChange > 0){
        $("#stockDt").append(
    '<div class="row">'+ 
    '<p class="text-first fs-3"> Lastest close value: <span id ="winT">$' + formatJSON.stockData.results[len-1].c + '( + ' + closeChange.toFixed(2) + ')</span></p>' +
    '</div><br>'
    )}else{
            $("#stockDt").append(
        '<div class="row">'+ 
        '<h3 class="text-first fs-3"> At close: <span id ="loseT">$' + formatJSON.stockData.results[len-1].c + '('  + closeChange.toFixed(2) + ')</span>' +
        '</div><br>'
        )
    }
    for (i = 0; i < len; i++) {
    $("#stockDt").append(
		'<hr><div class="row"><div class="col-lg-2 mx-auto"><p class="fs-5  text-center">Date: ' + formatJSON.Dates[i] + '</p></div>'+
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5" >Vol: ' + (formatJSON.stockData.results[i].v/1000000).toFixed(2) + 'M' + '</p></div>' + 
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5">Open: ' + formatJSON.stockData.results[i].o.toFixed(2) + '</p></div>' + 
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5">High: ' + formatJSON.stockData.results[i].h.toFixed(2) + '</p></div>' + 
		'<div class="col-lg-2 text-center mx-auto"><p class="fs-5">Low: ' + formatJSON.stockData.results[i].l.toFixed(2) + '</p></div>' + 
		'</div><br>' 
		  );
    }
    }
    else{
        alert("stock Price no available")
    }
}
//get data from database
function phpGet(dateGet) {
    a = $.ajax({
        method: "POST",
        url: "final.php",
        data: { method: "getStock", date: dateGet }
    }).done(function (data) {
        $("#historyDisplay").html("");
        len = data.result.length;
       var numberH;
        if (len === 0) {
            alert("0 result found");
        }
        else {
            if (len < maxEntry) {
            numberH = len;
            } else {
               numberH = maxEntry;
            }
            $("#historyDisplay").append( '<div class ="container border border-primary" id="histD">' +'<div class="row">' + 
            '<h1 class="text-first fs-1">History</h1><p class="fs-4">'+numberH+' record(s) are selected. </p></div>')
            for (i = 0; i < numberH; i++) {
                var formatJSON = data.result[i].jsonData.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                if(data.result[i].queryType  === "news"){
            $("#histD").append('<hr><div class="row"><div class="col-lg-2 mx-auto"><p class="fs-5  text-center">Date: ' + data.result[i].dateTime + '</p></div>'+
            '<div class="col-lg-2 text-center mx-auto"><p class="fs-5" >Stock: ' + data.result[i].stockTicker+ '</p></div>' + 
            '<div class="col-lg-2 text-center mx-auto"><p class="fs-5">Type: ' + data.result[i]. queryType + '</p></div>' + 
            '<div class="col-lg-2 text-center mx-auto">  <button class="btn btn-primary" type="button" id="ExploreBtn" onclick="newsH('+formatJSON+')">Explore</button>'+ 
            '</div><br>')
                }
                else{
                    $("#histD").append('<hr><div class="row"><div class="col-lg-2 mx-auto"><p class="fs-5  text-center">Date: ' + data.result[i].dateTime + '</p></div>'+
            '<div class="col-lg-2 text-center mx-auto"><p class="fs-5" >Stock: ' + data.result[i].stockTicker+ '</p></div>' + 
            '<div class="col-lg-2 text-center mx-auto"><p class="fs-5">Type: ' + data.result[i]. queryType + '</p></div>' + 
            '<div class="col-lg-2 text-center mx-auto">  <button class="btn btn-primary" type="button" id="ExploreBtn" onclick="stockH('+formatJSON+')">Explore</button>' + 
            '</div><br>')
                }
            }
        }

    }).fail(function (error) {
        console.log("error", error.statusText);
        $("#log").prepend("ps error " + new Date() + "<br>");
    }
    );
}
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