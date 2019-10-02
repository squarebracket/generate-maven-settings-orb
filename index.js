const { parseStringPromise, Builder } = require('xml2js');
const { readFileSync, writeFileSync } = require('fs');
const { argv } = require('process');

const servers = [];
const username = argv[2];
const password = argv[3];
const filter = argv[4];

const settings = {
  settings: {
    $: {
      xmlns: "http://maven.apache.org/SETTINGS/1.0.0",
      'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
      'xsi:schemaLocation': "http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd",
    },
    interactive: false,
    offline: false,
  }
};

function processServer(repo) {
  if (!filter || (new RegExp(filter).test(repo.url))) {
    servers.push({
      id: repo.id,
      username,
      password,
    });
  }
}

parseStringPromise(readFileSync('pom.xml')).then(pom => {
  pom.project.repositories[0].repository.forEach(processServer);
  pom.project.pluginRepositories[0].pluginRepository.forEach(processServer);
  settings.settings.servers = [{server: servers}];
  const builder = new Builder();
  const xml = builder.buildObject(settings);
  writeFileSync('settings.xml', xml);
});

