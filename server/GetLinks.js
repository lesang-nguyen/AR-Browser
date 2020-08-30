var http = require('http');
var cheerio = require('cheerio');

var port = 12001;

//create a server object:
http.createServer(function (req, response) {
	var query = req.headers['head'];

	var options = {
	  host: 'www.google.com',
	  port: 80,
	  path: '/search?q=' + query,
	  headers: {
	        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
	  }
	};

	content = "";

	http.get(options, function(res) {
	  var body = '';
	  res.on('data', function(chunk) {
	    body += chunk;
	  });
	  res.on('end', function() {

       var $ = cheerio.load(body);

        $("li").each(function() {
            var link = String($(this));
            if (link.includes("www.") && !link.includes("www.google") && !link.includes("gbar")){
            	link = link.substring(link.indexOf("www."));
            	link = link.substring(0, link.indexOf("%"));
            	if (link.length > 0){
	            	content += link + ",";
	        	}
        	}
        });

	     response.end(content); //end the response
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	}); 
}).listen(port,'192.168.1.12');

console.log('Starting Node Server');