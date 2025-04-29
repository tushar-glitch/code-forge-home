
export interface FileType {
  id: string;
  name: string;
  isFolder: boolean;
  children?: FileType[];
  defaultContent?: string;
}
