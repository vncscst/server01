var express = require('express');
const db = require('../util/db');
var mqtt = require('../util/mqtt')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var json = mqtt.getObj()
  //var _data = json.
  var _temp = json.Temperatura
  var _hum = json.Umidade
  console.log(json)
  res.render('index', { title: 'SERVER01', data: new Date(), temp: _temp, hum: _hum });
  
});

// router.get('/mod_cozinha', function(req, res, next) {
//   res.render('mod_cozinha', { json: mod_cozinha_json });
// });

router.get('/mod_cozinha/json', function(req, res, next) {
  var msg = mqtt.getMsg()
  res.status(200).send(msg);
});

router.get('/historico', function(req, res, next) {
  db.query('SELECT * FROM local_db.mod_historico order by id desc;',[],function(erro,resultado){
    if(erro){
      res.status(200).send(erro)
    }
    res.render('historico', { lista: resultado });
  })
  
});

module.exports = router;
