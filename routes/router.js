module.exports = function(app,axios,cheerio,db){
   
   app.get("/scrape", function(req, res) {
  axios.get("https://www.mlbtraderumors.com//").then(function(response) {
    var $ = cheerio.load(response.data);

    rumorObject= []

    $("article").each(function(i, element) {
      var result = {}
           result.title = $(this)
                .find("h2")
                .children("a")
                .text();
            result.link = $(this)
                .find("h2")
                .children("a")
                .attr("href");
           result.date = $(this)
                .find("p")
                .children("time")
                .text();
          result.summary = $(this)
                .find("div")
                .find("p:first-child")
                .text()
      if (result.title && result.summary && result.date && result.link) {
        rumorObject.push(result)
          db.Entry.findOneAndUpdate({'title': result.title},{$set: {'title':result.title, 'date':result.date, 'summary':result.summary, 'link':result.link}} , {upsert: true}, 
            function(err, inserted) {
              if (err) {
                console.log(err)
              } else {
                console.log(inserted)
              }
          })
        }
  });

    res.render("scrapes",{entry: rumorObject})
  });
});

app.get("/comments",function(req,res){
  db.Entry.find({}).then(function(dbEntry){
      console.log(dbEntry)
      var dbObject= {entry: dbEntry};
      res.render("index",dbObject);
  });
  
})

app.get("/addNoteForm/:id",function(req,res){
    var id = {id:req.params.id};
    res.render("comment",id);
    
})

app.post("/addNote",function(req,res){
    console.log(req.body.id);
    console.log(req.body.comments);
    db.Note.create({comments:req.body.comments}).then(function(data){
        db.Entry.update({_id:req.body.id},{$push:{note:data._id} }, { new: true }).then(function(result){
            console.log(result);
            db.Entry.find({}).then(function(dbArticle){
                var dbObject= {article: dbArticle};
                res.render("index",dbObject);
            });       
        }).catch(function(err){console.log(err)});        
    });
});

app.get("/entries", function(req, res) {
  // Grab every document in the Articles collection
  db.Entry.find({})
    .then(function(dbEntry) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbEntry);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
}