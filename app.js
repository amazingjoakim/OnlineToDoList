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
    var filename = "." + purl.pathname;
    console.log(filename);
    if (filename == "./") {
        filename = "./todo.html"
    }
    var q = url.parse(req.url, true).query;

    if (typeof q.tasks != 'undefined') {
        console.debug(" if of save: " + q.tasks + q.qdate);
        var savecontent;
        savecontent = q.tasks + "*" + q.qdate;
        fs.writeFileSync("indexlist.html", savecontent, 'utf-8');
        console.log(savecontent + "file saved!");
        myEvent.emit('write', res);
    }
    else if (filename == "./todo.html") {
        myEvent.emit('write', res);
    }
    else if (filename == "./tasklistW.html" || filename == "./tasklistR.html") {
        if (typeof q.notetext != 'undefined') {
            console.debug(" if of save: " + q.notetext);
            fs.writeFileSync("Note.txt", q.notetext, 'utf-8');
            console.log(" note file saved!");
        }

        var split = filename.split('.');
        console.log("split: " + split[1] + "." + split[2]);

        var datas = fs.readFileSync("." + split[1] + "1." + split[2], 'utf-8');
        var datas1 = fs.readFileSync("./Note.txt", 'utf-8');
        var datas2 = fs.readFileSync("." + split[1] + "2." + split[2], 'utf-8');
        res.writeHead(200, { 'content-type': 'text/html' });

        res.write(datas);
        res.write(datas1);
        res.write(datas2);
        console.log("load end");
        res.end();
    }



    
}).listen(8080);

function load(res, str) {
    var task = str[0];
    var date = str[1];
    console.log("load: " + task + " " + date);

    res.write("<div class='listbox'> \n"
        + "<a href='http://localhost:8080/tasklistR.html'> <div class='link'></div></a> \n"
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




