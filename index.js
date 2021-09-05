
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5000

const { persistStats, fetchStats } = require('./services/db')
const { getData } = require('./services/webscrapper')

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/', async (req, res) => {
  payload = await getData()
  await persistStats(payload)
  res.render('pages/index.ejs',{payload:  JSON.stringify(payload)});
})

app.get('/history', async (req, res) => {
  const payload = await fetchStats()
  res.render('pages/history.ejs', {payload: JSON.stringify(payload)})
})

app.get('/stats', async (req, res) => {
  const payload = await fetchStats()
  res.render('pages/stats.ejs', {payload: JSON.stringify(payload)})
})

app.listen(port, () => {
  console.log('Server started in port ', port)
})
