var express = require('express');
var router = express.Router();
var http = require("http").Server(express);
var io = require('socket.io')(http);
var url = require('url');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = mongoose.model('User');
	
/*var server = http.createServer(function(request,response)
{
	var path = url.parse(request.url).pathname;
	
	switch(path)
	{
		default:
			response.writeHead(404);
			response.end();
			break;
	}
});*/

//io.on('connection',function(socket){});
io.on('connection',function(socket){
	
	socket.on('disconnect', function(){
		
	});
});

http.listen(3000,function(){
	
});
//server.listen(3000);

//var listener = io.listen(server);
//	listener.sockets.on('connection',function(socket){
//});

router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Pubcrawl',
		scripts: ['js/index.js']
	});
});

router.get('/commands', function(req, res, next) {
	res.render('commands', { title: 'Express' });
});

router.post('/signup', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) return res.status(400).send(err);

        passport.authenticate('local')(req, res, function () {
			return res.send('signed up');
        });
    });
});

router.post('/login', function(req, res, next){
	User.find({username: req.body.username}, function(err, data){
		if(data.length==0) res.status(400).send('user does not exist');
		else next();
	});
}, passport.authenticate('local'), function(req, res) {
	//req.session.cookie.expires = false;
	//req.session.cookie.maxAge = 5 * 60 * 1000;
	req.session.user = req.user;
	req.session.save(function (err) {
		if (err) return res.send('an error occured');
		return res.json(req.user); //res.send('authorized');
	});
	console.log(req.session);
});

//TODO figure out if this should be POST or if /login and /signup should be GET
router.get('/logout', function(req, res) {
    req.logout();
	res.status(200).send('signed out');
});

module.exports = router;