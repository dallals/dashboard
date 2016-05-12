var express = require("express")
var path = require("path");
var bodyParser= require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded( {extended: true }));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){

	Post.find({})
		.populate('comments')
		.exec(function(err, posts){
			res.render("index", {all_posts:posts});	
		})	 	 	

		// res.render("index", {all_posts:posts});
	// Comment.find({}, function(err, comments){
	// 	res.render("index", {all_comments:comments});
	// })
 })



 mongoose.connect('mongodb://localhost/message_board');

 var Schema = mongoose.Schema
 var postSchema = new mongoose.Schema({
 	name:String,
 	text:String,
 	comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
 });

postSchema.path('name').required(true, 'User name cannot be blank');
postSchema.path('text').required(true, 'User animal cannot be blank');

 var commentSchema = new mongoose.Schema({
 	_post: {type: Schema.Types.ObjectId, ref: 'Post'},
 	name: String,
 	text: String,
 	created_at: {type: Date, default: new Date}
 });

commentSchema.path('name').required(true, 'User name cannot be blank');
commentSchema.path('text').required(true, 'User animal cannot be blank');



var Post = mongoose.model('Post', postSchema);
var Comment = mongoose.model('Comment', commentSchema);

 app.get('/post/:id', function(req, res){
 	Post.findOne({_id: req.params.id})
 	.populate('comments')
 	.exec(function(err, post){
 		res.render('post', {post: post});
 	});
 });

 app.post('/posts/:id', function(req, res){
 	Post.findOne({_id: req.params.id}, function(err, post){
 		var comment = new Comment(req.body);
 		comment._post = post._id;
 		post.comments.push(comment);
 		comment.save(function(err){
 			post.save(function(err){
 				if(err) {console.log("Error");}
 				else {res.redirect('/');}
 			});
 		});
 	});
 });

 app.post('/message', function(req, res){
 	console.log("POST DATA", req.body);
 	var message = new Post({name: req.body.name, text: req.body.text})
 	message.save(function(err){
 		if(err){
 			console.log("something went wrong");
 			res.redirect('/');	
 		}else{
 			console.log("Success");
 			res.redirect('/')
 		}
 	})
 })



var server = app.listen(8000, function(){
	console.log("On port 8000");
	console.log("message board")
})

// <% if(all_posts[x]._comments === all_comments[j]._id) { %>