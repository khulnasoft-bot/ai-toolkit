import { tool, } from '@ai-toolkit/ai';
import { z } from 'zod';
const myUIMessage = undefined;
myUIMessage.parts.forEach(part => {
    if (part.type === 'tool-weather') {
        if (part.state === 'input-available') {
            part.input.location;
        }
    }
});
export const serverWeatherTool = tool({
    description: 'Get the weather in a location',
    inputSchema: z.object({ location: z.string() }),
    execute({ location }) {
        return {
            condition: 'sunny',
            temperature: 72,
        };
    },
});
//# sourceMappingURL=tool-set-shared.js.map