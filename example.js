const slack_file_downloader = require("./index.js");

// Launch Slack export
slack_file_downloader({
  path: "dataset/**/*.json",
  concurrency: 6
});
