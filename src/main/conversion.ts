import ffmpeg from 'fluent-ffmpeg';

export const convertTrack = (inputPath: string, outputPath: string, format: string) => {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat(format)
      .on('end', () => resolve())
      .on('error', (error) => reject(error))
      .save(outputPath);
  });
};
