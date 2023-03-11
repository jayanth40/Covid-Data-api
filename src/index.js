const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get('/totalRecovered',async (req,res)=>{
    const data = await connection.find({})
    
    let recovered =0
    for(let i=0; i< data.length;i++){
        recovered = recovered+ data[i].recovered
    }
    let ans ={data:{_id:"total",recovered:recovered}}
    res.json(ans)
})
app.get('/totalActive',async (req,res)=>{
    const data = await connection.find({})
    
    let recovered =0
    let infected =0
    for(let i=0; i< data.length;i++){
        recovered = recovered+ data[i].recovered
        infected = infected+ data[i].infected
    }
    let ans ={data:{_id:"total",active:infected- recovered}}
    res.json(ans)
})
app.get('/totalDeath',async (req,res)=>{
    const data = await connection.find({})
    
    let deaths =0
   
    for(let i=0; i< data.length;i++){
        deaths = deaths+ data[i].death
       
    }
    let ans ={data:{_id:"total",death:deaths}}
    res.json(ans)
})

app.get('/hotspotStates',async (req,res)=>{
    const data = await connection.find({})
    let ans1 =[]
    
    for(let i=0; i< data.length;i++){
        let recovered =  data[i].recovered
        let infected =  data[i].infected
        let rate =(infected- recovered)/infected
        rate = parseInt(rate*100000)
        rate = rate/100000
        if(rate >0.1){
           
            let ans ={state:data[i].state,rate:rate}
            ans1.push(ans)
        }
    }
    let result = {data:ans1}
    res.json(result)
})


app.get('/healthyStates',async (req,res)=>{
    const data = await connection.find({})
    let ans1 =[]
    
    for(let i=0; i< data.length;i++){
      let death =  data[i].death
        let infected =  data[i].infected
        let rate =death/infected
        rate = parseInt(rate*100000)
        rate = rate/100000
        if(rate <0.005){
            let ans ={state:data[i].state,rate:rate}
            ans1.push(ans)
        }
    }
    let result = {data:ans1}
    res.json(result)
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;