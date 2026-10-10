import fs from 'node:fs';
export async function saveRawChunks({ result, filename, }) {
    const rawChunks = [];
    for await (const chunk of result.fullStream) {
        if (chunk.type === 'raw') {
            rawChunks.push(chunk.rawValue);
        }
    }
    fs.writeFileSync(`output/${filename}.chunks.txt`, rawChunks.map(chunk => JSON.stringify(chunk)).join('\n'));
}
//# sourceMappingURL=save-raw-chunks.js.map