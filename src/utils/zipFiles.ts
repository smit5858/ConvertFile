import JSZip from 'jszip';
import { downloadFile } from './downloadFile';

interface ZipItem {
  blob: Blob;
  name: string;
}

export async function zipAndDownload(
  files: ZipItem[],
  zipFilename: string
): Promise<void> {
  const zip = new JSZip();
  
  files.forEach(({ blob, name }) => {
    zip.file(name, blob);
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  downloadFile(url, zipFilename);
  
  // Revoke the object URL after download to free memory
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}
