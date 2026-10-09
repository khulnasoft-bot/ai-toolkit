import { convertReadableStreamToArray } from './convert-readable-stream-to-array';

export async function convertResponseStreamToArray(response: Response): Promise<string[]> {
  if (response.body == null) {
    return [];
  }

  return convertReadableStreamToArray(response.body.pipeThrough(new TextDecoderStream()));
}
