import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

// This is just for testing you would not want to create the table every
// time you start up the app feel free to improve this code :)
db.run(`CREATE TABLE todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    const local = { tasks: [] }

   
    db.all('SELECT id, task FROM todo', function (err, rows) {
        if (err) {
            console.log(err)
        } else {
            
            local.tasks = rows.map(row => ({ id: row.id, task: row.task }))
            res.render('index', local) //moved render down so that page renders after db is ubdated
        }
    })

    console.log('GET called')
})

app.post('/', function (req, res) {
    console.log('adding todo item')
    const stmt = db.prepare('INSERT INTO todo (task) VALUES (?)')
    stmt.run(req.body.todo)
    stmt.finalize()
})

app.post('/delete', function (req, res) {
    console.log('deleting todo item')
    const stmt = db.prepare('DELETE FROM todo where id = (?)')
    stmt.run(req.body.id)
    stmt.finalize()
})

// Start the web server
app.listen(3000, function () {
    console.log('Listening on port 3000...')
})
