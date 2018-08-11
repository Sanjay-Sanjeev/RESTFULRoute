var express          = require("express"), 
    app              = express(),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer");
    
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });

//App config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose model config
var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
    
});
var Blog = mongoose.model("Blog", blogSchema );

/*Blog.create({
    
    title: "TEST BLOG SANJUSS",
    image: "https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=96479273726f0c5c859499ea11593067&auto=format&fit=crop&w=500&q=60",
    body: "Sanjukuttante test blog aanu ithu..engana undu mone dineshaa"
    
});*/

//RESTFul routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
})

// INDEX ROUTE
app.get("/blogs", function(req, res){
    
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
        
    });
    
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    
    res.render("new");
    
});


//CREATE ROUTE

app.post("/blogs", function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    
    Blog.create( req.body.blog, function(err, blog){
        
        if (err) {
            res.render("new");
        } else {
            
            res.redirect("/blogs");
        }
        
    });
    
});


//SHOW ROUTE

app.get("/blogs/:id", function(req, res) {
    
    Blog.findById( req.params.id, function(err, reqBlog){
        
        if (err) {
            res.redirect("/blogs");
        } else {
            
            res.render("show", { blog: reqBlog });
        }
        
    } );
    
});


// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
    
    Blog.findById( req.params.id, function(err, foundBlog){
     
     if (err) {
         res.redirect("/blogs");
     } else {
          res.render("edit", {blog: foundBlog });
     }   
        
    });
    
   
    
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body); 
   Blog.findByIdAndUpdate( req.params.id, req.body.blog, function(err, updatedBlog){
       
       if (err) {
            res.redirect("/blogs");
       } else {
           
           res.redirect("/blogs/" + req.params.id)
       }
       
   });
    
});

// DELETE ROUTE

app.delete("/blog/:id", function(req, res){
    
    Blog.findByIdAndRemove( req.params.id, function(err){
        
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs")
        }
        
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("Server started");
    
});

