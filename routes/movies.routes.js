const Movie = require('../models/Movie.model');
const Celebrity = require('../models/Celebrity.model');
// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require('express').Router();

router.get('/movies/create', (req, res, next) => {
  // this returns a promise, and inside of it its the data.
  Celebrity.find()
    // handlebars only takes objects when doing renders  you cant just give handler bars an array, have to give an array within an object
    .then((celebsArray) => {
      //  we have to convert it into an object
      res.render('movies/new-movie.hbs', { celebsArray });
    })
    .catch((error) => console.log(error));
});
router.post('/movies/create', (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  Movie.create({ title, genre, plot, cast })

    .then(() => res.redirect('/movies'))
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get('/movies', (req, res, next) => {
  Movie.find()
    .then((moviesArray) => {
      // console.log(moviesArray);
      res.render('movies/movies.hbs', { moviesArray });
    })
    .catch((err) => {
      console.log(err);
      next(error);
    });
});

router.get('/movies/:movieId', (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .populate('cast')
    .then((theMovie) => {
      console.log('retrieved data', { theMovie });
      res.render('movies/movie-details', { theMovie });
    })
    .catch((err) => {
      console.log(err);
      next(error);
    });
});

router.post('/movies/:movieId/delete', (req, res, next) => {
  const { movieId } = req.params;
  Movie.findByIdAndDelete(movieId)
    .then(() => res.redirect('/movies'))
    .catch((err) => {
      console.log(err);
      next(error);
    });
});

router.get('/movies/:movieId/edit', (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .populate('cast')
    .then((editMovie) => {
      res.render('movies/edit-movie', editMovie);
    })
    .catch((err) => {
      console.log(err);
    });
  // Celebrity.find()
  //   .then((celebdB) => {
  //     res.render('/movies/edit-movie', { celebdB });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     next(error);
  //   });
});

router.post('/movies/:id/edit', (req, res, next) => {
  // post request so it'll be in body
  const { title, genre, plot, cast } = req.body;

  const movieId = req.params.id;
  Movie.findByIdAndUpdate(movieId, { title, genre, plot, cast })
    .then(() => res.redirect(`/movies/${movieId}`))
    .catch((err) => console.log(err));
});
module.exports = router;
