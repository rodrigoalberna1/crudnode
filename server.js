const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri =
  'mongodb+srv://<username>:<password>@cluster0.f6t34.mongodb.net/crud?retryWrites=true&w=majority'

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('crud')
  app.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
  })
})

app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('home')
})

app.get('/show', (req, res) => {
  db.collection('funcionario')
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err)
      console.log(results)
      res.render('show', { data: results })
    })
})

app.post('/show', (req, res) => {
  db.collection('funcionario').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('salvo no banco de dados')
    res.redirect('/show')
  })
})

app
  .route('/edit/:id')
  .get((req, res) => {
    var id = req.params.id
    db.collection('funcionario')
      .find(ObjectID(id))
      .toArray((err, result) => {
        if (err) return console.log(err)
        res.render('edit', { data: result })
      })
  })

  .post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    db.collection('funcionario').updateOne(
      {
        _id: ObjectID(id)
      },
      {
        $set: {
          name: name,
          surname: surname
        }
      },
      (err, result) => {
        if (err) return console.log(err)
        res.redirect('/show')
        console.log('Banco atualizado com sucesso')
      }
    )
  })

app.route('/delete/:id').get((req, res) => {
  var id = req.params.id
  db.collection('funcionario').deleteOne(
    {
      _id: ObjectID(id)
    },
    (err, result) => {
      if (err) return console.log(err)
      console.log('Valor removido com sucesso')
      res.redirect('/show')
    }
  )
})
