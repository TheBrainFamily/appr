const request = require('request');
const config = require('./config');
const log = require('./log');
module.exports = function postDeploy() {
  const issueUrl = `https://${config.githubUsername}:${config.githubToken}@api.github.com/repos/${config.githubOrg}/${config.githubRepo}/issues/${config.githubPullRequestId}/comments`;

  log('GitHub Issue URL', issueUrl);

  const body = `
  :shipit: This branch has been deployed to:

  `;

  request.post(
    {
      url: issueUrl,
      headers: { 'User-Agent': 'ci' },
      body: JSON.stringify({ body })
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
};
