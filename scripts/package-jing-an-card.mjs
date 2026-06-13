import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), '..');
const cardRoot = path.resolve(repoRoot, '..', 'cards', '谍影迷梦');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export const paths = {
  state: path.join(cardRoot, 'tavern-cards-state.json'),
  statusBuild: path.join(repoRoot, 'dist', '谍影迷梦', '界面', '状态栏', 'index.html'),
  statusReplacement: path.join(cardRoot, '正则', '状态栏界面.html'),
  artifact: path.join(cardRoot, '谍影迷梦.png'),
};

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function parseChunks(buffer) {
  assert.deepEqual(buffer.subarray(0, 8), pngSignature, 'artifact is not a PNG');
  const chunks = [];
  let offset = 8;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const typeBuffer = buffer.subarray(offset + 4, offset + 8);
    const type = typeBuffer.toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    const expectedCrc = buffer.readUInt32BE(offset + 8 + length);
    const actualCrc = crc32(Buffer.concat([typeBuffer, data]));
    assert.equal(actualCrc, expectedCrc, `invalid CRC in ${type} chunk`);
    chunks.push({ type, data: Buffer.from(data) });
    offset += length + 12;
    if (type === 'IEND') break;
  }

  return chunks;
}

function encodeChunk({ type, data }) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const output = Buffer.alloc(data.length + 12);
  output.writeUInt32BE(data.length, 0);
  typeBuffer.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), data.length + 8);
  return output;
}

function decodeTextChunk(data) {
  const separator = data.indexOf(0);
  assert.notEqual(separator, -1, 'invalid PNG tEXt chunk');
  return {
    keyword: data.toString('latin1', 0, separator),
    text: data.toString('latin1', separator + 1),
  };
}

function encodeTextChunk(keyword, text) {
  return Buffer.concat([Buffer.from(keyword, 'latin1'), Buffer.from([0]), Buffer.from(text, 'latin1')]);
}

function cardExtensions(card) {
  const extensions = card.data?.extensions ?? card.extensions;
  assert.ok(extensions, 'card metadata has no extensions object');
  return extensions;
}

export function materializeRegexScripts() {
  const state = JSON.parse(fs.readFileSync(paths.state, 'utf8'));
  return Object.entries(state.regex_scripts).map(([scriptName, config]) => {
    const replaceString = config.replace_file
      ? fs.readFileSync(path.resolve(cardRoot, config.replace_file), 'utf8')
      : (config.replaceString ?? '');
    const materialized = { ...config, scriptName, replaceString };
    delete materialized.replace_file;
    return materialized;
  });
}

export function updateCardMetadata(buffer, regexScripts) {
  const replaced = new Set();
  const chunks = parseChunks(buffer).map(chunk => {
    if (chunk.type !== 'tEXt') return chunk;
    const text = decodeTextChunk(chunk.data);
    if (text.keyword !== 'chara' && text.keyword !== 'ccv3') return chunk;

    const card = JSON.parse(Buffer.from(text.text, 'base64').toString('utf8'));
    cardExtensions(card).regex_scripts = regexScripts;
    const encoded = Buffer.from(JSON.stringify(card), 'utf8').toString('base64');
    replaced.add(text.keyword);
    return { type: 'tEXt', data: encodeTextChunk(text.keyword, encoded) };
  });

  assert.deepEqual([...replaced].sort(), ['ccv3', 'chara']);
  return Buffer.concat([pngSignature, ...chunks.map(encodeChunk)]);
}

export function verifyCardMetadata(buffer, expectedScripts) {
  const found = new Map();
  for (const chunk of parseChunks(buffer)) {
    if (chunk.type !== 'tEXt') continue;
    const text = decodeTextChunk(chunk.data);
    if (text.keyword !== 'chara' && text.keyword !== 'ccv3') continue;
    const card = JSON.parse(Buffer.from(text.text, 'base64').toString('utf8'));
    found.set(text.keyword, cardExtensions(card).regex_scripts);
  }

  assert.deepEqual([...found.keys()].sort(), ['ccv3', 'chara']);
  assert.deepEqual(found.get('chara'), expectedScripts);
  assert.deepEqual(found.get('ccv3'), expectedScripts);
}

function syncStatusReplacement() {
  const html = fs.readFileSync(paths.statusBuild, 'utf8').trim();
  assert.match(html, /<head>[\s\S]*<\/head>/);
  assert.match(html, /<body>[\s\S]*<\/body>/);
  fs.writeFileSync(paths.statusReplacement, `\`\`\`html\n${html}\n\`\`\`\n`, 'utf8');
}

function main() {
  syncStatusReplacement();
  const scripts = materializeRegexScripts();
  const original = fs.readFileSync(paths.artifact);
  const updated = updateCardMetadata(original, scripts);
  verifyCardMetadata(updated, scripts);

  const backup = `${paths.artifact}.before-ledger`;
  if (!fs.existsSync(backup)) fs.copyFileSync(paths.artifact, backup);

  const temporary = `${paths.artifact}.tmp`;
  fs.writeFileSync(temporary, updated);
  verifyCardMetadata(fs.readFileSync(temporary), scripts);
  fs.copyFileSync(temporary, paths.artifact);
  fs.unlinkSync(temporary);
  verifyCardMetadata(fs.readFileSync(paths.artifact), scripts);
  console.log(`Packaged ${path.relative(repoRoot, paths.artifact)} with ${scripts.length} regex scripts.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) main();
