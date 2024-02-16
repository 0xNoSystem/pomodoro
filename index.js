import express from 'express';
import bodyParser from 'body-parser';

import { MongoClient, ServerApiVersion,ObjectId} from 'mongodb'; 
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))


const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function updateCount(myCount) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const db = client.db("pomodoro").collection('count');

    await db.updateOne({_id:new ObjectId('65cf751b9a5407b61129dbff')}, {$set:{count: parseInt(myCount) }})
    
    console.log('saved with success');
    
  }catch(e){
  console.log(e.message)
  } 
}

async function getCount(){
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const db = client.db("pomodoro").collection('count');

    const count = await db.findOne({_id:new ObjectId('65cf751b9a5407b61129dbff')});

    console.log('count retrieved with success');
    return count.count;
    
  }catch(e){
    console.log(e.message);
  }
}

app.get('/', async (req, res)=>{

    const lastSave_count = await getCount();
    res.render('index.ejs', {
        count: lastSave_count
    });
})

app.post('/csave', async (req,res)=>{

    const count = req.body.count;

    try{
      await updateCount(count);
      res.redirect('/');
    }catch(err){
      console.log(err);
      res.redirect('/');
    }
    
})



app.listen(port, ()=>{
    console.log("Server listening on port " + port)
})