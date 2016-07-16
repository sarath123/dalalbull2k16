var http = require("http");
var request = require("request");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){
    console.log('Connection');});
server.listen(8021,'174.36.220.83');
var sock=io.listen(server);
sock.sockets.on('connection', function(socket){
    request('http://174.36.220.83:8020/leaderboard', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body); 
        socket.broadcast.emit('message', {'message': body});
    }
});

    setInterval(function(){
    request('http://174.36.220.83:8020/leaderboard', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body); 
        socket.broadcast.emit('message', {'message': body});
    }
});
},600000);
    request('http://174.36.220.83:8020/nifty', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); 
        socket.broadcast.emit('message', {'nifty': body});
    }
});

    setInterval(function(){
    request('http://174.36.220.83:8020/nifty', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body); 
        socket.broadcast.emit('message', {'nifty': body});
    }
});
},1000);

});
var chat = sock
  .of('/chat')
  .on('connection', function (socket) {
  	var id;
    socket.on('hi',function(data){console.log('test'+data.company);

    	if(id)
    		clearInterval(id);
    request.post({url:'http://174.36.220.83:8020/graph', form: {company:data.company}}, function(error,response,body){ 
    if (!error && response.statusCode == 200) {
        console.log(body); 
        chat.emit('graph_values', {'values': body});
    }
});

    id=setInterval(function(){
    request.post({url:'http://174.36.220.83:8020/graph', form: {company:data.company}}, function(error,response,body){ 
    if (!error && response.statusCode == 200) {
        console.log(body); 
        chat.emit('graph_values', {'values': body});
    }
});

},300000);

});

  });
var chat1 = sock
  .of('/stockinfo')
  .on('connection', function (socket) {
    var id;
    socket.on('hi',function(data){console.log('test'+data.company);

        if(id)
            clearInterval(id);
    request.post({url:'http://174.36.220.83:8020/graph', form: {company:data.company}}, function(error,response,body){ 
    if (!error && response.statusCode == 200) {
        console.log(body); 
        chat1.emit('graph_values', {'values': body});
    }
});

    id=setInterval(function(){
    request.post({url:'http://174.36.220.83:8020/graph', form: {company:data.company}}, function(error,response,body){ 
    if (!error && response.statusCode == 200) {
        console.log(body); 
        chat1.emit('graph_values', {'values': body,'company':data.company});
    }
});

},300000);

});

  });
var portfolio = sock
  .of('/portfolio')
  .on('connection', function (socket) {
    var id;
    socket.on('hi',function(data){console.log('test'+data.user_id);

        if(id)
            clearInterval(id);
    request.post({url:'http://174.36.220.83:8020/portfolio', form: {user_id:data.user_id}}, function(error,response,body){ 
    if (!error && response.statusCode == 200) {
        console.log(body); 
        portfolio.emit('details', {'values': body});
    }
});
    
    id=setInterval(function(){
    request.post({url:'http://174.36.220.83:8020/portfolio', form: {user_id:data.user_id}}, function(error,response,body){ 
    if (!error && response.statusCode == 200) {
        console.log(body); 
        portfolio.emit('details', {'values': body});
    }
});

},300000);

});

  });
