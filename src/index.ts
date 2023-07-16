#!/usr/bin/env node
// Line above specifies that the file must be executed by npx and ts-node

import https, { RequestOptions } from "https";

const random = Math.floor(Math.random() * 100);

const options: RequestOptions = {
  hostname: "collectionapi.metmuseum.org",
  path: `/public/collection/v1/objects/${random}`,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function getData(): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        resolve(data);
      });
    });
    request.on("error", (error) => {
      reject(error);
    });
    request.end();
  });
}

getData()
  .then((data) => {
    const result = JSON.parse(data);
    const { title, artistDisplayName, objectID, repository, creditLine } =
      result;
    const by = artistDisplayName
      ? `${artistDisplayName} `
      : `unknown artist (exciting, isn't it)`;
    console.log(
      `In this case we recommend ${title} by ${by} with object ID ${objectID} at ${repository}. ${creditLine}`
    );
  })
  .catch((error) => {
    console.log(error);
  });
