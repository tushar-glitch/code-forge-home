
export interface FileType {
  id: string;
  name: string;
  isFolder: boolean;
  children?: FileType[];
  defaultContent?: string;
}

export type CodeTree = FileType;
