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
	socket.on('disconnect', function(data){
		
	});
	
	socket.on('saveRace', function(data){
		
	});
	
	socket.on('loadRaces', function(data){
		
	});
	
	socket.on('newRace', function(racename){
		Race.find({name: newName}, function(err, data){
			if(data.length==0){
				var race = new Race({
					name: newName,
				});
				race.save(function(err, savedRace){
					if(err){ return handleError(req, res, 500, err); }
					else{
					
					}
				});
			}
		});
	});
	
	socket.on('deleteRace', function(raceid){
		var query = {};
		query._id = raceid.Id;
		Race.remove(
			query,
			function(err, data){
				if(err){ return handleError(req, res, 500, err); }
				res.status(200).send('race successfully removed');
			}
		);
	});
});

/*http.listen(3000,function(){
	
});*/
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

router.get('/pubs-view', function(req, res, next) {
	res.render('pubs', { title: 'Express' });
});

router.get('/users-view', function(req, res, next) {
	res.render('users', { title: 'Express' });
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
		return res.status(200).json(req.user);
	});
	//console.log(req.session);
});

//TODO figure out if this should be POST or if /login and /signup should be GET
router.get('/logout', function(req, res) {
    req.logout();
	res.status(200).send('signed out');
});

module.exports = router;
