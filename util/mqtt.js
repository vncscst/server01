const mqtt = require("mqtt");
const db = require('../util/db');

//---------------------------------------------------
//DEBUG
var debugConsole = true;

//DADOS
var mod_msg = "Sem Valor";
var mod_obj;

//MQTT Broker connection parameters
const mqttHost = '192.168.0.200'
const mqttPort = '1883'
const mqttUser= 'admin'
const mqttPassword = 'vine3561'
const mqttClientId = `node_${Math.random().toString(16).slice(3)}`
const mqttUrl = `mqtt://${mqttHost}:${mqttPort}`

//MQTT topics
var mqttTopicCmd = ""
var mqttTopicSts = "modulo_cozinha/stat"
const mqttTopicLwt = 'node/lwt'


//MQTT Client
const mqttCient = mqtt.connect(mqttUrl, {
mqttClientId,
clean: true,
connectTimeout: 4000,
username: mqttUser,
password: mqttPassword,
reconnectPeriod: 1000,})

function debug(mensagem) {    //Função para imprimir na porta serial
    if (debugConsole) {
      console.log(mensagem)
    }
  }

  //Subscribe to topics
mqttCient.on('connect', () => {
    debug('*MQTT - Conectado!')
    mqttCient.subscribe([mqttTopicSts], () => {
      debug("*MQTT - Subscribe to topic: "+ mqttTopicSts)
    })
  })
  
mqttCient.on('message', (mqttTopicSts, payload) => {
  //Mensagem
  let msg = payload.toString()
  debug("*MQTT - Received Message: "+ mqttTopicSts +" - "+ msg)
  mod_msg = msg;
    
  

  debug("*MQTT - MOD Message: "+ mod_msg)

  //JSON
  let payloadObj = JSON.parse(msg)
  mod_obj = payloadObj;

  let temp = payloadObj.Temperatura
  let umid = payloadObj.Umidade
  let datahora = payloadObj.DateTime
  var dateMysql = new Date(datahora * 1000);
  let now = new Date();

  // debug("DataHora: "+ dateMysql)
  // debug("Temperatura: "+ temp)
  // debug("Umidade: "+ umid)

  //Adicionar no MYSQL

  let sql = "INSERT INTO mod_historico(data, temp, hum) VALUES (FROM_UNIXTIME("+datahora.toString()+")," +temp.toString()+","+umid.toString()+");"
  debug("*MQTT - SQL Message: "+ sql)
  db.query(sql)

})

exports.getMsg = function() {
    return mod_msg;
  };

exports.getObj = function() {
    return mod_obj;
    };

