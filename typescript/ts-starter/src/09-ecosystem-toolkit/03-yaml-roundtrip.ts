import YAML from "yaml";
import fs from "fs-extra";
// const obj = YAML.parse("name: world\n");
// const text = YAML.stringify({ hello: "world" });

//Convert a YAML file to JSON and back; verify round-trip.
async function yamlToJson() {
  const yamlText = await fs.readFile(".data/sample.yaml", "utf8");
  const obj = YAML.parse(yamlText);
  await fs.writeJSON(".data/yamltojson.json", obj, { spaces: 2 });
}
async function jsonToYaml() {
  const obj = await fs.readJSON(".data/yamltojson.json");
  const yamlText = YAML.stringify(obj);
  await fs.writeFile(".data/jsontoyaml.yaml", yamlText, "utf8");
}

yamlToJson();
jsonToYaml();
