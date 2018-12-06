var menubar = require('menubar')

var mb = menubar({
        height: 100,
        width: 500,
        dir: 'src'
    });

mb.on('ready', function ready () {
  console.log('app is ready');
});

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

// to serve our JavaScript, CSS and index.html
expressApp.use(express.static('./'));

expressApp.set('cookie', "");


expressApp.get('/authenticate', function (req, res) {
    var username =  new Buffer(req.query.username, 'base64').toString();
    var password = new Buffer(req.query.password, 'base64').toString();

    request.post(
        'https://pavlovmedia.atlassian.net/rest/auth/latest/session',

        { json:
                {"username": username,
                    "password": password}
        },

        function (error, response, body) {
            // console.log(error);
            // console.log(response);
            if (body.session !== undefined) {
                expressApp.set('cookie', body.session.name + "=" + body.session.value);
            }
            res.send(body);
        }
    );
});

expressApp.get('/users', function (req, res) {
    request.get(
        'https://pavlovmedia.atlassian.net/rest/api/3/user/search/?query=pavlovmedia',
        { headers: {cookie: expressApp.settings.cookie }},
        function (error, response, body) {
            res.send(body);
        }
    );
});


expressApp.get('/activeSprint', function (req, res) {
    request.get(
        'https://pavlovmedia.atlassian.net/rest/agile/latest/board/16/sprint',
        { headers: {cookie: expressApp.settings.cookie }},
        function (error, response, body) {
            res.send(body);
        }
    );
});

expressApp.get('/exit', function (req, res) {
    process.exit(0);
});



var port = process.env.PORT || 5000
expressApp.listen(port, () => console.log('Listening at http://localhost:5000'));