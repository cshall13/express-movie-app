var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+config.apiKey;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';



/* GET home page. */
router.get('/', function(req, res, next) {
	request.get(nowPlayingUrl,(error,response,movieData)=>{
		var movieData = JSON.parse(movieData);
  		res.render('movie_list', { 
  			movieData: movieData.results,
  			imageBaseUrl: imageBaseUrl,
  			titleHeader: "Welcome to my movie app. These are now playing." 
  		});
	});
});

// router.get('/search',(req,res)=>{
// 	res.send("The get search page");
// });

router.post('/search',(req,res)=>{
	// req.body is available because of the body parser module
	// body-parser module was installed when you created the express app
	// req.body is where POSTED data will live
	// res.json(req.body);
	var termUserSearchedFor = req.body.searchString;
	var searchUrl = apiBaseUrl + '/search/movie?query='+termUserSearchedFor+'&api_key='+config.apiKey;
	request.get(searchUrl,(error,response,movieData)=>{
		var movieData = JSON.parse(movieData);
  		res.render('movie_list', { 
  			movieData: movieData.results,
  			imageBaseUrl: imageBaseUrl, 
  			titleHeader: `Returning search results for ${termUserSearchedFor}.` 
  		});
  	});
	// res.send("The post search page");
});

router.get('/movie/:id', (req,res)=>{
	// the route has a :id in it. A : means WILDCARD
	// a wildcard is ANYTHING in that slot.
	// all wildcards in routes are available in req.params
	var thisMovieId = req.params.id;
	// build the URL per the API docs
	var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${config.apiKey}`;
	var thisCreditsUrl = `${apiBaseUrl}/movie/${thisMovieId}/credits?api_key=${config.apiKey}`;
	request.get(thisMovieUrl,(error,response,movieData)=>{
		request.get(thisCreditsUrl,(error,response,castData)=>{

			// use the request module to make an HTTP get request
			var newMovieData = (JSON.parse(movieData));
			var newCastData = (JSON.parse(castData));
			console.log(newCastData);
			// res.json(movieData);
			// first arg: the view file
			// second param: obj to send the view file
			res.render('single-movie',{
				newMovieData: newMovieData,
				newCastData: newCastData,
				imageBaseUrl: imageBaseUrl,
				titleHeader: `Welcome to the ${newMovieData.title} deets page.` 
			});
		});
	});
	// res.send(req.params.id);
});

module.exports = router;
