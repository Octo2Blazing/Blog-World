import express from "express";
import fileUpload from "express-fileupload";
import * as fs from 'fs';
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const filePath = "./storage/data.json";

app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/", express.static(path.join(dirname(fileURLToPath(import.meta.url)), "public")));

app.get("/", (req,res)=>{
    res.render("home.ejs");
})
app.get("/blog", (req, res)=>{
    res.render("blog.ejs");
})
app.get("/blog-form", (req, res)=>{
    res.render("blogForm.ejs");
})
app.get("/blog-post", (req, res)=>{
    fs.readFile(filePath, (err, fileData)=>{
        if(fileData.length !== 0) {
            const data = JSON.parse(fileData);
            res.render("seeAllBlog.ejs", {data});
        }else{
            const data = [];
            res.render("seeAllBlog.ejs", {data});
        }
    })
})

app.get("/blog-post/:title", (req,res)=>{
    fs.readFile(filePath, (err, fileData)=>{
        const data = JSON.parse(fileData).filter(obj=> obj["title"].replace(/\s+$/, "") === req.params.title);
        const formData = data[0]
        res.render("blogPost.ejs", {formData});
    })
})


// form data handling.
app.post("/submit",(req, res)=>{
    try{
        const {body,files} = req;
        const order = req.body.hidden_input.split(",");
        const filesBase64 = 
        files
        ? Array.isArray(files.image)
            ? files.image.map(file=>"data:image/*;base64," + file.data.toString("base64"))
            : "data:image/*;base64," + files.image.data.toString("base64")
        : " ";
        const formData = {
            title: body.title,
            heading: Array.isArray(body.heading)
                ? body.heading.map(heading=>heading)
                : body.heading,
            paragraph: Array.isArray(body.paragraph)
                ? body.paragraph.map(para=>para)
                : body.paragraph,
            order,
            filesBase64: Array.isArray(filesBase64)
                ? filesBase64.map(file=>file)
                : filesBase64,
        };
        const data = [];
        fs.readFile(filePath,"utf8",(err, fileData)=>{
            if(fileData.length !== 0){
                JSON.parse(fileData).forEach(obj => {
                    data.push(obj);
                });
            }
            data.push(formData);
            fs.writeFile(filePath, JSON.stringify(data, null,2),(err)=>{
                if(err) console.log(err);
            });

            res.render("blogPost.ejs", {formData});
        });

    }catch(err){
        res.send(err.message);
    }
})
app.put("/post/update/:title",(req,res)=>{
    
})
app.delete("/post/delete/:title", (req,res)=>{
    fs.readFile(filePath, (err, fileData)=>{
        let data = []
        if(fileData.length !== 0){
            data = JSON.parse(fileData);  
        }
        const newData = data.filter(ojb => ojb.title.replace(/\s+$/, "") !== req.params.title);
        fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err)=>{
            if(err) console.log(err);
        })
        res.status(200).json(newData);
    })
})

app.listen(4000, (err)=>{
    console.log("Server is running... http://localhost:4000");
})