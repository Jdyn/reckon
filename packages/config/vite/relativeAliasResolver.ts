import fs from 'fs/promises';
import path from 'path';
import { Alias } from 'vite';

const resolver: Alias = {
	find: /^(~\/.+)/,
	replacement: '$1',
	async customResolver(source, importer) {
		const [repo, filePath] = importer!.split('/packages/');
		const [pkg] = filePath.split('/src/');

		const sourcePath = source.substring(2);

		const absolutePath = `${repo}/packages/${pkg}/src/${sourcePath}`;

		const folderItems = await fs.readdir(path.join(absolutePath, '../'));

		const item = folderItems.find((i) => i.startsWith(sourcePath.split('/').at(-1) ?? ''));

		return absolutePath + path.extname(item!);
	}
};

export default resolver;
