const express = require('express');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(require('cors')());
app.use(express.static(path.join(__dirname, '..', 'public')));


const DB_PATH = path.join(__dirname, 'db.json');
function readDB(){ try{ return JSON.parse(fs.readFileSync(DB_PATH,'utf8')) }catch(e){ return {requests:[]}; } }
function writeDB(data){ fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }


// List requests
app.get('/api/requests', (req,res)=>{
const db = readDB();
res.json(db.requests);
});


// Create request
app.post('/api/requests', (req,res)=>{
const { name, phone, address, device, quantity, date } = req.body || {};
if(!name || !phone || !address) return res.status(400).json({error:'missing fields'});
const db = readDB();
const r = { id: nanoid(), name, phone, address, device: device||'unknown', quantity:quantity||1, date: date||null, status:'pending', createdAt: Date.now() };
db.requests.unshift(r);
writeDB(db);
res.status(201).json(r);
});


// Update (status, address, etc.)
app.put('/api/requests/:id', (req,res)=>{
const id = req.params.id;
const db = readDB();
const idx = db.requests.findIndex(x=>x.id===id);
if(idx===-1) return res.status(404).json({error:'not found'});
const { status, address, date } = req.body || {};
if(status) db.requests[idx].status = status;
if(address) db.requests[idx].address = address;
if(date) db.requests[idx].date = date;
writeDB(db);
res.json(db.requests[idx]);
});


// Delete
app.delete('/api/requests/:id', (req,res)=>{
const id = req.params.id;
const db = readDB();
db.requests = db.requests.filter(x=>x.id!==id);
writeDB(db);
res.json({ok:true});
});


// Fallback
app.get('*', (req,res)=> res.sendFile(path.join(__dirname, '..', 'public', 'index.html')) );


app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));