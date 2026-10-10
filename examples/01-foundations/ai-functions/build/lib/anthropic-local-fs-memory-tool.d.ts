export declare const anthropicLocalFsMemoryTool: ({
  basePath,
}: {
  basePath: string;
}) => import('@ai-toolkit/provider-utils').Tool<
  | {
      command: 'view';
      path: string;
      view_range?: [number, number];
    }
  | {
      command: 'create';
      path: string;
      file_text: string;
    }
  | {
      command: 'str_replace';
      path: string;
      old_str: string;
      new_str: string;
    }
  | {
      command: 'insert';
      path: string;
      insert_line: number;
      insert_text: string;
    }
  | {
      command: 'delete';
      path: string;
    }
  | {
      command: 'rename';
      old_path: string;
      new_path: string;
    },
  string
>;
