import { getFileSuffix } from '@/common/fileSuffix';

export function fileTypeFromPath(fsPath: string): string {
    const suffix = getFileSuffix(fsPath);
    return suffix.startsWith('.') ? suffix.slice(1) : suffix;
}
