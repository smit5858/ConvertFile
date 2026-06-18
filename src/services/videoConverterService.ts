import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;

/**
 * Loads the FFmpeg WASM module.
 * Uses ES modules from unpkg CDN for speed and simplicity.
 */
export async function loadFfmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  if (isLoading) {
    // Wait for the instance to finish loading if another request initiated it
    while (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (ffmpegInstance) return ffmpegInstance;
  }

  isLoading = true;
  try {
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  } catch (error) {
    console.error('Failed to load FFmpeg WASM core:', error);
    throw new Error('Failed to initialize the video conversion engine. Please check your network connection.');
  } finally {
    isLoading = false;
  }
}

/**
 * Converts an MP4 file to a high-quality WebM file.
 */
export async function convertMp4ToWebm(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFfmpeg();
  
  const inputName = 'input.mp4';
  const outputName = 'output.webm';
  
  // Clean up any potential leftover files in the FFmpeg FS
  try {
    await ffmpeg.deleteFile(inputName);
  } catch {
    // Ignore error if file doesn't exist
  }
  try {
    await ffmpeg.deleteFile(outputName);
  } catch {
    // Ignore error if file doesn't exist
  }

  // Set up progress tracking
  ffmpeg.on('progress', (event) => {
    if (onProgress && typeof event.progress === 'number') {
      // Scale from 0-1 to 0-99 (save 100 for when writing and cleanup are fully done)
      const progressPercent = Math.min(Math.round(event.progress * 100), 99);
      onProgress(progressPercent);
    }
  });

  try {
    // 1. Write file to FFmpeg's virtual file system
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // 2. Execute conversion
    // Settings description:
    // -c:v libvpx-vp9: High-quality modern VP9 video codec
    // -crf 15: Constant Rate Factor of 15 (visually lossless quality)
    // -b:v 0: Required when using VP9 CRF mode to let quality determine bitrate
    // -cpu-used 4: Balances CPU encoding time and compression ratio (highly recommended for WASM runtime speed)
    // -c:a libopus: High quality Opus audio codec
    // -b:a 256k: 256kbps audio bitrate for excellent audio quality
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libvpx-vp9',
      '-crf', '15',
      '-b:v', '0',
      '-cpu-used', '4',
      '-c:a', 'libopus',
      '-b:a', '256k',
      outputName
    ]);

    // 3. Read the converted file from the FFmpeg FS
    const outputData = await ffmpeg.readFile(outputName);
    const convertedBlob = new Blob([outputData as any], { type: 'video/webm' });
    
    if (onProgress) onProgress(100);
    return convertedBlob;
  } catch (error) {
    console.error('Video conversion execution error:', error);
    throw new Error('Video conversion failed. The file may be unsupported or corrupted.');
  } finally {
    // 4. Memory management: delete temporary files from WASM FS to prevent memory leaks
    try {
      await ffmpeg.deleteFile(inputName);
    } catch {
      // Ignore
    }
    try {
      await ffmpeg.deleteFile(outputName);
    } catch {
      // Ignore
    }
  }
}
