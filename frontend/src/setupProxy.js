//IMPORTANT: This is a HACK HACK in order to allow React Dev Tools to publish a page that allows CORS and CORB
//           The callback is called by the react-scripts module to allow the user to set up a custom proxy but
//           I use it to workaround CORS.
module.exports = function(app) {
	app.use(function (req, res, next) {
		res.set({
			"Access-Control-Allow-Origin": "http://localhost:3200",
			"Access-Control-Allow-Methods": "DELETE,GET,PATCH,POST,PUT",
			"Access-Control-Allow-Headers": "Content-Type,Authorization",
			"Access-Control-Allow-Credentials": "true"
		});
		next();
	});
};
