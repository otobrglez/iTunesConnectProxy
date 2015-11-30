var express = require('express');
var itc = require("itunesconnect");
var auth = require('basic-auth');

var app = express();
var itunes = null;
var Report = itc.Report;

// Auth
app.all('*', function(req, res, next) {
   var user = auth(req);

   if (!user) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
   }

   var options = {
      errorCallback: function(err) {
         res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
         return res.send("repa");
      },
      loginCallback: function(resp) {
         console.log('Dela');
      }
   }

   if (itunes == null) {
      itunes = new itc.Connect(user.name, user.pass, options);
   }

   next();
});

app.get('/total-downloads', function(req, res) {
   itunes.request(Report.ranked().time(1, 'days'), function(error, result) {
      if (error != null) {
         return res.status(500).send({ error: 'Something blew up.' });
      }

      var data = {
          value: result[0].units
      };
      res.send(JSON.stringify(data));
   });
});

app.listen(3001);
