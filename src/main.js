var menubar = require('menubar')

var mb = menubar({
        height: 200,
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
    request.post(
        'https://pavlovmedia.atlassian.net/rest/auth/latest/session',
        { json:
                {"username": Buffer.from(req.query.username, 'base64').toString(),
                    "password": Buffer.from(req.query.password, 'base64').toString()}
        },
        function (error, response, body) {
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