import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { applyDiff } from './apply-diff';
export function createApplyPatchExecutor(workspaceRoot) {
  const editor = new WorkspaceEditor(workspaceRoot);
  return async ({ callId, operation }) => {
    console.log(`[${callId}] Applying ${operation.type} to ${operation.path}`);
    switch (operation.type) {
      case 'create_file':
        return editor.createFile(operation);
      case 'update_file':
        return editor.updateFile(operation);
      case 'delete_file':
        return editor.deleteFile(operation);
    }
  };
}
export class WorkspaceEditor {
  root;
  constructor(root) {
    this.root = root;
  }
  async createFile(operation) {
    try {
      const targetPath = await this.resolve(operation.path);
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      const content = applyDiff('', operation.diff, 'create');
      await fs.writeFile(targetPath, content, 'utf8');
      return { status: 'completed', output: `Created ${operation.path}` };
    } catch (error) {
      return {
        status: 'failed',
        output: `Error creating file: ${error.message}`,
      };
    }
  }
  async updateFile(operation) {
    try {
      const targetPath = await this.resolve(operation.path);
      const original = await fs.readFile(targetPath, 'utf8').catch(error => {
        if (error?.code === 'ENOENT') {
          throw new Error(`Cannot update missing file: ${operation.path}`);
        }
        throw error;
      });
      const patched = applyDiff(original, operation.diff);
      await fs.writeFile(targetPath, patched, 'utf8');
      return { status: 'completed', output: `Updated ${operation.path}` };
    } catch (error) {
      return {
        status: 'failed',
        output: `Error updating file: ${error.message}`,
      };
    }
  }
  async deleteFile(operation) {
    try {
      const targetPath = await this.resolve(operation.path);
      await fs.rm(targetPath, { force: true });
      return { status: 'completed', output: `Deleted ${operation.path}` };
    } catch (error) {
      return {
        status: 'failed',
        output: `Error deleting file: ${error.message}`,
      };
    }
  }
  async resolve(relativePath) {
    const resolved = path.resolve(this.root, relativePath);
    if (!resolved.startsWith(this.root)) {
      throw new Error(`Operation outside workspace: ${relativePath}`);
    }
    return resolved;
  }
}
//# sourceMappingURL=apply-patch-file-editor.js.map
