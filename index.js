#!/usr/bin/env node

const spawn = require('./scripts/spawn');
const config = require('./scripts/config');
const log = require('./scripts/log');
const preDeploy = require('./scripts/pre-deploy');
const postDeploy = require('./scripts/post-deploy');
const localExp = './node_modules/.bin/expo';
log('Logging into Expo...');

if (process.env.ONLY_NOTIFY_GITHUB) {
  log('Notifying GitHub...');
  postDeploy();
} else {
  spawn(localExp, ['login', '-u', config.expUsername, '-p', config.expPassword, '--non-interactive'], loginError => {
    if (loginError) {
      throw new Error('Failed to log into Expo');
    } else {
      log('Logged into Expo.');
      log('Preparing project for publish...');
      preDeploy();
    }

    log('Publishing project into Expo.');
    spawn(localExp, ['publish'], publishError => {
      if (publishError) {
        throw new Error('Failed to publish package to Expo');
      } else {
        log('Published project.');
      }
    });
  });
}
