const express=require("express");
const bodyParser=require("body-parser");
const cheerio = require("cheerio");
const request = require("request");

var content=[];
var indeces=[];

const ejs =require("ejs");
const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','ejs');

app.get("/", function(req,response)
{
    response.sendFile(__dirname+"/index.html");
});

app.get("/How_to_use", function(req, response)
{
    response.sendFile(__dirname+"/Functionality.html")
});

app.post("/",function(req,res)
{
    let url=req.body.url;
    let texts=req.body.concept;
    let concept=texts.split(',');
    console.log(concept);
    request(url, function(err, response, html){

        if (!err)
        {
            const $ = cheerio.load(html);  
            for(var l=0;l<concept.length;l++)
            { 
                let tag_items=$(":contains('"+concept[l]+"')");
                tag_items.each(function(i)
                {
                    if(tag_items.eq(i).contents().not(tag_items.eq(i).children()).text().includes(concept[l]))
                    {
                        if(tag_items.eq(i).get(0).tagName=='h1'||tag_items.eq(i).get(0).tagName=='h2'||tag_items.eq(i).get(0).tagName=='h3'||tag_items.eq(i).get(0).tagName=='h4')
                        {
                            indeces.push(content.length);    
                        }
                        content.push(tag_items.eq(i).contents().not(tag_items.eq(i).children()).text());
                    }
                });
            }
            res.render("contents",{content:content, indeces:indeces});
            content=[];
            indeces=[];
        }
    });

});

app.listen(process.env.PORT||3000, function()
{
    console.log("The server is running on the port 3000.")
});

function search(concept)
{
    
}