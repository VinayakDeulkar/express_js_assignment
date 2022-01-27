const bodyParser=require('body-parser')
const express=require('express')
const fs=require('fs')
const cookieSession=require('cookie-session')
const cookieParser=require('cookie-parser')
const nodemailer=require('nodemailer')
const app=express();
const PORT=8899;

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs');
app.get("/",(req,res)=>{
    const file=fs.readFileSync('post.json')
    const data=JSON.parse(file)
    res.render('form',{data:data.posts})
})
async function main(req,res,next) {
    let testAccount = await nodemailer.createTestAccount();
  
    let transporter = nodemailer.createTransport({
        service:'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'emperorrock50@gmail.com', // generated ethereal user
            pass: 'EmperorRock50', // generated ethereal password
        },
    });
  
    let info = await transporter.sendMail({
      from: 'emperorrock50@gmail.com', // sender address
      to: "emperorrock50@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    next();
  }
  
app.post('/',main,(req,res)=>{
    let Title=req.body.Title;
    let Description=req.body.Description;
    let id=Math.random()
    let bodyData={id:id,Title:Title,Description:Description}
    const word=fs.readFileSync('post.json')
        const data2=JSON.parse(word)
        data2.posts.push(bodyData)
        const FinalData=JSON.stringify(data2)
        console.log(FinalData);
        fs.writeFile('post.json',`${FinalData}`,(error)=>{
                if(error) throw error;
                res.writeHead(301,{Location:'/'})
                res.end();})
})
app.get('/delete/:id',(req,res)=>{
    let id=req.params.id;
    const word=fs.readFileSync('post.json')
    const data=JSON.parse(word)
    data.posts.splice(id,1)
    const FinalData=JSON.stringify(data)
    console.log(FinalData);
    fs.writeFile('post.json',`${FinalData}`,(error)=>{
        if(error) throw error;
        res.writeHead(301,{Location:'/'})
        res.end();})
})
app.get("/update/:id",(req,res)=>{
    let id=req.params.id;
    console.log(id);
    const word=fs.readFileSync('post.json')
    const data=JSON.parse(word)
    console.log(data);
    const finaldata=data.posts.filter(item=>item.id==id)
    console.log(finaldata);
    res.render('update',{data:finaldata})
  
})
app.post("/updatedata/:id",(req,res)=>{
    const word=fs.readFileSync('post.json')
    const data=JSON.parse(word)
    console.log(data);
    let Title=req.body.title;
    let Description=req.body.des;
    console.log(Title);
    console.log(Description);
    data.posts.forEach(element => {
        if(element.id==req.params.id){

            element.Title=Title
            element.Description=Description
        }
    });
    const FinalData=JSON.stringify(data)
        console.log(FinalData);
        fs.writeFile('post.json',`${FinalData}`,(error)=>{
                if(error) throw error;
                res.writeHead(301,{Location:'/'})
                res.end();})

})
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`);
})