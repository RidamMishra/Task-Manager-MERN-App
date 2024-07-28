const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const memberModel = require('./models/members');
const listModel = require('./models/teamList');
const teamSchema = require('./models/teams');

//ENV
const salt = bcrypt.genSaltSync(10);
const secret = 'awg1298udjwey09qi32jwn';

const app = express();
app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(cookieParser());

mongoose.connect('mongodb+srv://taskmanagerapp9:AwD5EJxYBwhUWYDu@taskmanagercluster.pz7o3lw.mongodb.net/taskManager?retryWrites=true&w=majority&appName=taskManagerCluster');

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 465,
    secure:true,
    auth: {
        user:'taskmanagerapp9@gmail.com',
        pass:'sgya yenm pbic nbya'
    }
});

app.post('/signup',(req,res)=>{
    let {uname,password,email,role}=req.body;
    uname=uname.toUpperCase();
    email=email.toLowerCase();
    
    memberModel.findOne({email:email})
    .then(user=>{
        if(user){
            res.json('0');
        }
        else{
            const passwordEncrypt=bcrypt.hashSync(password,salt);
            let msg;
            if(role==='member'){
                memberModel.create({uname,password:passwordEncrypt,email,lead:false});
                res.json('Account successfully created as member only');
                msg = 'You will soon be added to teams and assigned tasks by leads.';
            }
            else{
                memberModel.create({uname,password:passwordEncrypt,email,lead:true});
                res.json('Account successfully created as member and lead');
                msg = 'Start making your teams and assigning tasks to members.';
            }
            transporter.sendMail({
                to: email,
                subject: 'New Account Created',
                html: `<h1>WELCOME TO THE TASK MANAGER APP ${uname}</h1>${msg}`
            })
        }
    })
})

app.post('/otp',(req,res)=>{
    let {email} = req.body;
    email=email.toLowerCase();
    let generatedOTP = Math.round(Math.random()*10000)
    transporter.sendMail({
        to: email,
        subject: 'Verification OTP',
        html: `<h1>${generatedOTP}</h1> is your OTP for email verification.`
    })
    res.json(generatedOTP);
})

app.post('/login', (req,res)=>{
    let {email,password}=req.body;
    email=email.toLowerCase();
    
    memberModel.findOne({email:email})
    .then(user=>{
        if(!user){
            res.json('0');
        }
        else{
            if(bcrypt.compareSync(password,user.password)){
                jwt.sign({lead:user.lead,uname:user.uname,email:user.email},secret,{},(err,token)=>{
                    res.cookie('token',token).json(user.lead);
                });
            }
            else{
                res.json('1');
            }
        }
    })
})

app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        res.json(info);
    })
})

app.post('/logout',(req,res)=>{
    res.clearCookie('token').json('cookie deleted');
})

app.post('/create',(req,res)=>{
    let {newTeam} = req.body;
    const {token} = req.cookies;

    newTeam=newTeam.toLowerCase();

    listModel.findOne({team:newTeam})
    .then(user=>{
        if(user){
            res.json('Team name already exists');
        }
        else{
            jwt.verify(token,secret,{},(err,info)=>{
                const newCollection = mongoose.model(newTeam,teamSchema,newTeam);
                newCollection.createCollection();
                listModel.create({team:newTeam,createdBy:info.uname});
                newCollection.create({member:info.uname,email:info.email,assignment:'',lead:true,complete:true});
                transporter.sendMail({
                    to: info.email,
                    subject: 'New Team Created',
                    html: `<h1>${newTeam} has been created succesfully</h1><p>Add members and assign tasks to this team</p>`
                })
            })
            res.json('Team created successfully. Go to Home to assgin members');
        }
    })

})

async function deleteTeams(delTeam){
    await listModel.deleteOne({team:delTeam});
    await mongoose.connection.dropCollection(delTeam);
}

app.post('/delete', (req,res)=>{
    let {delTeam} = req.body;
    const {token} = req.cookies;

    delTeam = delTeam.toLowerCase();
    
    listModel.findOne({team:delTeam})
    .then(user=>{
        if(!user){
            res.json('No such team exists');
        }
        else{
            let creator,email;
            jwt.verify(token,secret,{},(err,info)=>{
                creator = info.uname;
                email = info.email
            })
            if(creator!==user.createdBy){
                res.json('Only team creator can delete team');
            }
            else{
                res.json('Team deleted successfully');
                deleteTeams(delTeam);
                transporter.sendMail({
                    to: email,
                    subject: `${delTeam} Deleted`,
                    html: `<h1>${delTeam} has been deleted succesfully</h1>`
                })
            }
        }
    })
})

app.get('/display',async (reg,res)=>{
    const teams = await listModel.find({});
    res.send(teams);
})

app.get('/displaymembers',async (reg,res)=>{
    const teams = await memberModel.find({});
    res.send(teams);
})

app.post('/addcheck',(req,res)=>{
    const {token} = req.cookies;
    const {selTeam} = req.body;
    const teamCollection = mongoose.model(selTeam,teamSchema);

    jwt.verify(token,secret,{},(err,info)=>{
        teamCollection.findOne({member:info.uname})
        .then(user=>{
            if(!user){
                res.json('0');
            }
            else if(!user.lead){
                res.json('1');
            }
            else{
                res.json('2');
            }
        })
    })  
})

app.post('/updatecheck',async (req,res)=>{
    const {token} = req.cookies;
    const {selTeam} = req.body;
    const teamCollection = mongoose.model(selTeam,teamSchema);
    const members = await teamCollection.find({});

    jwt.verify(token,secret,{},(err,info)=>{
        teamCollection.findOne({member:info.uname})
        .then(user=>{
            if(!user){
                res.json('0');
            }
            else if(!user.lead){
                res.json('1');
            }
            else{
                res.send(members);
            }
        })
    })  
})

app.post('/addmem',(req,res)=>{
    let {selTeam,selMem,lead,ass}=req.body;
    const teamCollection = mongoose.model(selTeam,teamSchema);
    let email='';

    memberModel.findOne({uname:selMem})
    .then(user1=>{
        email = user1.email;
        teamCollection.findOne({member:selMem})
        .then(user=>{
            if(user){
                res.json('0');
            }
            else{
                teamCollection.create({member:selMem,email,assignment:ass,lead,complete:false});
                let role = lead ? 'lead' : 'member';
                let task = ass==='' ? 'NONE': ass;
                res.json('1');
                transporter.sendMail({
                    to: email,
                    subject: `Added to ${selTeam}`,
                    html: `<h1>You have been added to ${selTeam} as a ${role}</h1><p>Your current assignment: ${task}</p><a href="http://localhost:3000/login">Login to view your assignment</a>`
                })
            }
        })
    })
})

app.post('/update', async (req, res) => {
    const {selTeam,selMem,ass,comp,lead}=req.body;
    const teamCollection = mongoose.model(selTeam,teamSchema);

    await teamCollection.findOne({member:selMem})
    .then((user)=>{
        user.assignment = ass;
        user.complete = comp;
        user.lead = lead;
        user.save();
        res.json('Updated Successfully');
        let task = ass==='' ? 'NONE': ass;
        let status = comp ? 'Completed' : 'Not Completed';
        transporter.sendMail({
            to: user.email,
            subject: `Assignment updated`,
            html: `<h1>Your assignment in ${selTeam} has been updated</h1><p>Assignment: ${task}</p><p>Completion status: ${status}</p><a href="http://localhost:3000/login">Login to view your assignment</a>`
        })
    })
})

app.post('/deletemem', async (req, res) => {
    const {selTeam,selMem}=req.body;
    const teamCollection = mongoose.model(selTeam,teamSchema);

    teamCollection.findOne({member:selMem})
    .then((user)=>{
        transporter.sendMail({
            to: user.email,
            subject: `Removed from ${selTeam}`,
            html: `<h1>You have been removed from ${selTeam}</h1>`
        })
    })

    await teamCollection.deleteOne({member:selMem})
    res.json('Member deleted successfully');
})

app.post('/mytasks',(req,res)=>{
    const {selTeam}=req.body;
    const {token}=req.cookies;
    const teamCollection = mongoose.model(selTeam,teamSchema);

    jwt.verify(token,secret,{},(err,info)=>{
        teamCollection.findOne({member:info.uname})
        .then(user=>{
            if(!user){
                res.json('0');
            }
            else{
                res.json({team:selTeam,ass:user.assignment,status:user.complete});
            }
        })
    })
})

app.listen(3001,()=>{
    console.log('ServerRunning');
})