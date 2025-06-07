export type FileInfo = {
  basename: string;
  href: string;
  relativePath: string;
};

export function isFileInfoEqual(a: FileInfo, b: FileInfo): boolean {
  return a.href === b.href;
}
