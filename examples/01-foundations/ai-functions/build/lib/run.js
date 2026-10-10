import 'dotenv/config';
import { APICallError } from '@ai-toolkit/ai';
import { print } from './print';
export function run(fn) {
  fn().catch(error => {
    console.error(error);
    if (APICallError.isInstance(error)) {
      console.log();
      print('Request body:', error.requestBodyValues);
      print('Response body:', error.responseBody);
    }
  });
}
//# sourceMappingURL=run.js.map
