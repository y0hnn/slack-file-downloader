const axios = require("axios");
const queue = require("queue");
const glob = require("glob");
const fs = require("fs");
const Path = require("path");

module.exports = options => {
  const defaultOptions = {
    path: "dataset/**/*.json",
    concurrency: 6
  };
  const finalOptions = { ...defaultOptions, ...options };
  const { path, concurrency } = finalOptions;
  const q = queue();
  q.concurrency = concurrency;
  q.autostart = true;
  q.on("end", function(result, err) {
    console.log("Everything has been downloaded!", err);
  });

  glob(path, {}, async function(er, files) {
    files.map(filename => {
      readJsonFileAsync(filename, (err, data) => {
        if (!err && Array.isArray(data)) {
          data.map(content => {
            if ("files" in content) {
              const { files } = content;
              files.map(file => {
                if ("url_private_download" in file) {
                  const dir =
                    Path.resolve(Path.dirname(filename)) + "/attachments/";
                  const path_to_save = dir + file.id + " - " + file.name;
                  if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                  }
                  q.push(() =>
                    download(file.url_private_download, path_to_save)
                  );
                }
              });
            }
          });
        }
      });
    });
  });
};

function readJsonFileAsync(filepath, callback) {
  fs.readFile(filepath, "utf-8", function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      const result = JSON.parse(data);
      if (result) {
        callback(null, result);
      } else {
        callback("parse error", null);
      }
    }
  });
}

async function download(url, path) {
  console.log("Downloading : " + url);

  // axios image download with response type "stream"
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream"
  });

  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(path));

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });

    response.data.on("error", () => {
      reject();
    });
  });
}
