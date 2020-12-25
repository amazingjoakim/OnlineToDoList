var http = require('http');
var fs = require('fs');
var url = require('url');
var events = require('events');

var myEvent = new events.EventEmitter();

myEvent.on('write', function (res) {
    var data = fs.readFileSync("./todo1.html", 'utf-8');
    var data1 = fs.readFileSync("./indexlist.html", 'utf-8');
    var data2 = fs.readFileSync("./todo2.html", 'utf-8');
    res.writeHead(200, { 'content-type': 'text/html' });

    res.write(data);
    load(res, data1.split('*'));
    res.write(data2);
    console.log("load end");
    res.end();

});

http.createServer(function (req, res) {
    purl = url.parse(req.url, true);
    filename = "." + purl.pathname;
    console.log(filename);
    bool = false;
    if (filename == "./") {
        filename = "./todo.html"
    }
    var q = url.parse(req.url, true).query;

    if (typeof q.tasks != 'undefined') {
        console.debug(" if of save: " + q.tasks + q.qdate);
        var savecontent;
        savecontent = q.tasks + "*" + q.qdate;
        fs.writeFileSync("indexlist.html", savecontent, 'utf-8');
            console.log("file saved!");
        myEvent.emit('write', res);
    }
    else {
        myEvent.emit('write', res);
    }


    
}).listen(8080);

function load(res, str) {
    var task = str[0];
    var date = str[1];
    console.log("load: " + task + " " + date);

    res.write("<div class='listbox'> \n"
        + "<div class='del' onclick='del(this.childNodes[1].innerText)'> \n"
        + "<p hidden class='hidp'>" + task + "</p></div> \n"
        + "<h3>" + task + "</h3> \n"
        + "<p class='dead'> Deadline: " + date + "</p> \n"
        + "<p class='status'> Status: " + "\n"
        + "<form class='formbox'><select name='boxstatus'>"
        + "<option value = 'b'>Not Started</option><option value='c'>Done</option><option value='a'>Under Way</option></select ></form> \n "
        + "<form> <input class='numbox' type='number' name='order'> </form> \n"
        + "</p> </div>");



}




