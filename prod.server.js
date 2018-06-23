var express = require('express');
var config = require('./config');
var axios = require('axios');

var app = express();

var apiRoutes = express.Router();

const headers = {
  referer: 'https://c.y.qq.com/',
  host: 'c.y.qq.com'
}

apiRoutes.get('/getDiscList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios
    .get(url, {headers, params: req.query})
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    })
});
apiRoutes.get('/lyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios
    .get(url, {headers, params: req.query})
    .then((response) => {
      let ret = response.data;

      if (typeof ret === 'string') {
        const reg = /^\w+\(({[^()]+})\)$/;
        const matches = ret.match(reg);
        if (matches) {
          ret = JSON.parse(matches[1]);
        }
      }
      res.json(ret);
    })
    .catch((e) => {
      console.log(e);
    })
});
apiRoutes.get('/getSongList', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  axios
    .get(url, {headers, params: req.query})
    .then((response) => {
      const reg = /{.+}/;
      let ret = response.data;
      if (typeof ret === 'string') {
        const matches = ret.match(reg);
        if (matches) {
          ret = JSON.parse(matches[0]);
        }
      }
      res.json(ret);
    })
    .catch((e) => {
      console.log(e);
    })
});
apiRoutes.get('/getTopList', (req, res) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  axios
    .get(url, {headers, params: req.query})
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    })
});
apiRoutes.get('/rank/getMusicList', (req, res) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  axios
    .get(url, {headers, params: req.query})
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    })
});
apiRoutes.get('/getHotKey', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  axios
    .get(url, {headers, params: req.query})
    .then((response) => {
      res.json(response.data);
    })
    .catch((e) => {
      console.log(e);
    })
});

app.use('/api', apiRoutes);

app.use(express.static('./dist'));

var port = process.env.PORT || config.build.port;

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening at http://localhost:${port}\n`);
})