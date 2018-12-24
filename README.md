# Slack File Downloader

You want to quit Slack? As you may have noticied, the export of a Workspace that Slack gives you does not include the files. Files are on Slack servers.
This little module is made for downloading these items directly in the dataset. Each channels containing attachments will have a folder `attachments` with items inside.

# Installation

```
npm install --save slack-file-downloader
```

or

```
yarn add slack-file-downloader
```

# How to use

The module is verbose and will tell you when it's over.
Options :
* `dataset` : path where to find Slack exports
* `concurrency` : maximum downloads to do in parallel

Example :
```
const slack_file_downloader = require("./index.js");

// Launch Slack export
slack_file_downloader({
  path: "dataset/**/*.json",
  concurrency: 6
});

```

# Contribute

Feel free to make some PRs!