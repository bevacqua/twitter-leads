'use strict';

var sortBy = require('lodash/sortBy');
var url = require('url');
var util = require('util');
var contra = require('contra');
var request = require('request');
var cheerio = require('cheerio');
var csv = require('csv-parse');
var base = 'https://ads.twitter.com';

function leads (options, done) {
  var o = options || {};
  var jar = request.jar();

  contra.waterfall([
    function logon (next) {
      var href = 'https://twitter.com/login';
      go(jar, 'GET', href, {}, next);
    },
    function login (res, body, next) {
      var $ = cheerio.load(body);
      var href = 'https://twitter.com/sessions';
      var params = {
        'session[username_or_email]': o.username,
        'session[password]': o.password,
        authenticity_token: secret($, 'authenticity_token'),
        ui_metrics: secret($, 'ui_metrics'),
        ui_metrics_seed: secret($, 'ui_metrics_seed'),
        scribe_log: '',
        remember_me: 1
      };
      go(jar, 'POST', href, params, next);
    },
    function authenticated (res, body, next) {
      var href = util.format('/accounts/%s/cards/csv?url_id=%s', o.ads, o.card);
      go(jar, 'GET', href, {}, next);
    },
    function parse (res, body, next) {
      var config = {
        relax: true,
        columns: true,
        auto_parse: true,
        auto_parse_date: true
      };
      csv(body, config, next);
    },
    function parsed (data, next) {
      if (o.since) {
        data = data.filter(byDate);
      }
      next(null, sortBy(data.map(toModel), 'time'));
    }
  ], done);
  function byDate (lead) {
    return lead.Timestamp > o.since;
  }
  function toModel (lead) {
    return {
      name: lead.Name,
      email: lead.Email,
      time: lead.Timestamp,
      handle: '@' + lead['Twitter handle']
    };
  }
}

function secret ($, field) {
  return $(util.format('[name=%s]', field)).val();
}

function go (jar, method, pathname, data, done) {
  request({
    url: url.resolve(base, pathname),
    method: method,
    jar: jar,
    form: data,
    followAllRedirects: true
  }, done);
}

module.exports = leads;
