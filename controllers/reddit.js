// Invoke 'strict' JavaScript mode
'use strict';

var api = require('./api');
var request = require('request');
var schedule = require('node-schedule');

exports.crawlRedditUrl = function(reddit_url)
{
  request(reddit_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var reqJSON = JSON.parse(body);
      for(var i = 0; i < reqJSON.data.children.length; i++)
      {
        var url = reqJSON.data.children[i].data.url;
        // http://stackoverflow.com/questions/10591547/how-to-get-youtube-video-id-from-url
        // modified to work with timestamps or a question mark
        // this line of code is licensed under cc by-sa 3.0
        if(url != null)
        {
          console.log('Adding video id: ' + url + ' to database');
          api.addVideo(url, function(err, _vid){
            if(err)
              console.log(err);
          });
        }
      }
    }
  });
};

// handles the POST request for crawling reddit
// adds the top videos to the database
exports.crawlReddit = function() {
  exports.crawlRedditUrl('https://www.reddit.com/r/deepintoyoutube/top/.json?limit=150&t=all'); //Get all time top videos - our bread and butter.
  setTimeout(function() {
    console.log('Finished crawling r/deepintoyoutube all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/deepintoyoutube/top/.json?limit=25&t=week'); //Get newer videos
  setTimeout(function() {
    console.log('Finished crawling r/deepintoyoutube weekly');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/NotTimAndEric/top/.json?limit=25&t=all');  //Get all time top videos, only a few since it's a niche area
  setTimeout(function() {
    console.log('Finished crawling r/NotTimAndEric all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/NotTimAndEric/top/.json?limit=5&t=month'); //Get new-ish videos
  setTimeout(function() {
    console.log('Finished crawling r/NotTimAndEric monthly');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/fifthworldvideos/top/.json?limit=100&t=all'); //A bit more weird stuff but it fits well
  setTimeout(function() {
    console.log('Finished crawling r/fifthworldvideos all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/weirdtube/top/.json?limit=25&t=all');  //Smaller sub so only grab a few
  setTimeout(function() {
    console.log('Finished crawling r/weirdtube all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/darksideofyoutube/top/.json?limit=25&t=all');  //Smaller sub so only grab a few
  setTimeout(function() {
    console.log('Finished crawling r/weirdtube all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/unknownvideos/search.json?limit=40&q=flair%3A%22funny%22&sort=top&restrict_sr=on&t=all'); //Filter this one by flair
  setTimeout(function() {
    console.log('Finished crawling r/unknownvideos all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/InterdimensionalCable/top/.json?limit=50&t=all');
  setTimeout(function() {
    console.log('Finished crawling r/InterdimensionalCable all time');
  }, 3000); //Short pause so we don't break reddit
  exports.crawlRedditUrl('https://www.reddit.com/r/InterdimensionalCable/top/.json?limit=10&t=month');
  console.log('Finished crawling r/InterdimensionalCable monthly');
};

// Run this function Hourly
schedule.scheduleJob('0 0 * * *', exports.crawlReddit);
