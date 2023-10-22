var URL="https://api.polygon.io/v3/reference/tickers/";
var apiKey = "apiKey=ot7olxzc3zhHpl0ttBurjWbzmLXvZGvm";
var psCounter=0;
getDisk();


function getDisk() {
	a=$.ajax({
		url: 'https://api.polygon.io/v3/reference/tickers/AAPL?apiKey=ot7olxzc3zhHpl0ttBurjWbzmLXvZGvm',
		method: "GET"
	}).done(function(data) {
		psCounter++;
		//clear out old data
		$("#processRun").html(psCounter);
		$("#processes").html("");
		len = data.results.length;
		//for (i=0;i<len;i++) {
			$("#processes").append("<tr><td>" + data.results.branding.icon_url+"</td><td>"+data.results.name+"</td></tr>");
	//	}
	}).fail(function(error) {
		errorCounter++;
		$("#logRun").html(errorCounter);
		console.log("error",error.statusText);
		$("#log").prepend("ps error "+new Date()+"<br>");
	});
}