const request = require('request');
const utils = require('./utils');
const config = require('./config');
const log = require('./log');
module.exports = function postDeploy() {
  const webUrl = config.webEndpoint
  const graphqlUrl = config.graphqlEndpoint
  const expUrl = `https://expo.io/@${config.expUsername}/${utils.readPackageJSON().name}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${expUrl}`;
  if (config.githubPullRequestId) {
    const issueUrl = `https://${config.githubUsername}:${config.githubToken}@api.github.com/repos/${config.githubOrg}/${config.githubRepo}/issues/${config.githubPullRequestId}/comments`;

    log('Exponent URL', expUrl);
    log('GitHub Issue URL', issueUrl);
    log('QR Code URL ', qrUrl);

    const body = `
  :shipit: Mobile app from this branch has been deployed to:
  ${expUrl}

  Download the [Expo](https://expo.io/) app and scan this QR code to get started!

  ![QR Code](${qrUrl})
  
  If you are on iOS you will have to go here: https://expo.io/@${config.expUsername}/${utils.readPackageJSON().name} manually.
  
  Web is available here: [${webUrl}](${webUrl})
  
  And if you must, you can connect to the graphql server here: [${graphqlUrl}](${graphqlUrl})
  `;

    request.post(
      {
        url: issueUrl,
        headers: {'User-Agent': 'ci'},
        body: JSON.stringify({body})
      },
      (error, response) => {
        if (error) {
          console.error('Failed to post comment to GitHub, an error occurred', error);
        } else if (response.statusCode >= 400) {
          console.error('Failed to post comment to GitHub, request failed with', response);
        } else {
          console.log(`Posted message to GitHub PR #${config.githubPullRequestId}`);
        }
      }
    );
  } else {
    console.log(`This is not Pull Request, but in case you need to take a look manually already, mobile: \n${expUrl} web: ${webUrl}, server: ${graphqlUrl}`)
  }
};
