import { generateText, stepCountIs } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
/**
 * @deprecated Use the `@ai-toolkit/mcp` package instead.
 *
import { experimental_createMCPClient, auth } from '@ai-toolkit/ai';
import type {
  OAuthClientProvider,
  OAuthClientInformation,
  OAuthClientMetadata,
  OAuthTokens,
} from '@ai-toolkit/ai';
*/
import { auth, createMCPClient } from '@ai-toolkit/mcp';
import 'dotenv/config';
import { exec } from 'node:child_process';
import { createServer } from 'node:http';
class InMemoryOAuthClientProvider {
  _tokens;
  _codeVerifier;
  _clientInformation;
  _redirectUrl = `http://localhost:${process.env.MCP_CALLBACK_PORT ?? 8090}/callback`;
  async tokens() {
    return this._tokens;
  }
  async saveTokens(tokens) {
    this._tokens = tokens;
  }
  async redirectToAuthorization(authorizationUrl) {
    const cmd =
      process.platform === 'win32'
        ? `start ${authorizationUrl.toString()}`
        : process.platform === 'darwin'
          ? `open "${authorizationUrl.toString()}"`
          : `xdg-open "${authorizationUrl.toString()}"`;
    exec(cmd, error => {
      if (error) {
        console.error(
          'Open this URL to continue:',
          authorizationUrl.toString(),
        );
      }
    });
  }
  async saveCodeVerifier(codeVerifier) {
    this._codeVerifier = codeVerifier;
  }
  async codeVerifier() {
    if (!this._codeVerifier) throw new Error('No code verifier saved');
    return this._codeVerifier;
  }
  get redirectUrl() {
    return this._redirectUrl;
  }
  get clientMetadata() {
    return {
      client_name: 'AI TOOLKIT MCP OAuth Example',
      redirect_uris: [String(this._redirectUrl)],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_post',
    };
  }
  async clientInformation() {
    return this._clientInformation;
  }
  async saveClientInformation(info) {
    this._clientInformation = info;
  }
  addClientAuthentication = async (headers, params, _url) => {
    const info = this._clientInformation;
    if (!info) {
      return;
    }
    const method = info.token_endpoint_auth_method;
    const hasSecret = Boolean(info.client_secret);
    const clientId = info.client_id;
    const clientSecret = info.client_secret;
    // Prefer the method assigned at registration; fall back sensibly
    const chosen = method ?? (hasSecret ? 'client_secret_post' : 'none');
    if (chosen === 'client_secret_basic') {
      if (!clientSecret) {
        params.set('client_id', clientId);
        return;
      }
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );
      headers.set('Authorization', `Basic ${credentials}`);
      return;
    }
    if (chosen === 'client_secret_post') {
      params.set('client_id', clientId);
      if (clientSecret) params.set('client_secret', clientSecret);
      return;
    }
    // none (public client)
    params.set('client_id', clientId);
  };
  async invalidateCredentials(scope) {
    if (scope === 'all' || scope === 'tokens') this._tokens = undefined;
    if (scope === 'all' || scope === 'client')
      this._clientInformation = undefined;
    if (scope === 'all' || scope === 'verifier') this._codeVerifier = undefined;
  }
}
async function authorizeWithPkceOnce(authProvider, serverUrl, waitForCode) {
  const result = await auth(authProvider, { serverUrl: new URL(serverUrl) });
  if (result !== 'AUTHORIZED') {
    const authorizationCode = await waitForCode();
    await auth(authProvider, {
      serverUrl: new URL(serverUrl),
      authorizationCode,
    });
  }
}
function waitForAuthorizationCode(port) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      if (!req.url) {
        res.writeHead(400).end('Bad request');
        return;
      }
      const url = new URL(req.url, `http://localhost:${port}`);
      if (url.pathname !== '/callback') {
        res.writeHead(404).end('Not found');
        return;
      }
      const code = url.searchParams.get('code');
      const err = url.searchParams.get('error');
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(
          '<html><body><h1>Authorization Successful</h1><p>You can close this window.</p></body></html>',
        );
        setTimeout(() => server.close(), 100);
        resolve(code);
      } else {
        res
          .writeHead(400)
          .end(`Authorization failed: ${err ?? 'missing code'}`);
        setTimeout(() => server.close(), 100);
        reject(new Error(`Authorization failed: ${err ?? 'missing code'}`));
      }
    });
    server.listen(port, () => {
      console.log(`OAuth callback: http://localhost:${port}/callback`);
    });
  });
}
async function main() {
  const authProvider = new InMemoryOAuthClientProvider();
  const serverUrl = 'https://mcp.vercel.com/';
  await authorizeWithPkceOnce(authProvider, serverUrl, () =>
    waitForAuthorizationCode(Number(8090)),
  );
  const mcpClient = await createMCPClient({
    transport: { type: 'http', url: serverUrl, authProvider },
  });
  const tools = await mcpClient.tools();
  console.log(`Retrieved ${Object.keys(tools).length} protected tools`);
  console.log(`Available tools: ${Object.keys(tools).join(', ')}`);
  const { text: answer } = await generateText({
    model: openai('gpt-4o-mini'),
    tools,
    stopWhen: stepCountIs(10),
    onStepFinish: async ({ toolResults }) => {
      if (toolResults.length > 0) {
        console.log('Tool execution results:');
        toolResults.forEach(result => {
          console.log(
            `  - ${result.toolName}:`,
            JSON.stringify(result, null, 2),
          );
        });
      }
    },
    system: 'You are a helpful assistant with access to protected tools.',
    prompt:
      'List the tools available for me to call. Arrange them in alphabetical order.',
  });
  await mcpClient.close();
  console.log(`FINAL ANSWER: ${answer}`);
}
main().catch(console.error);
//# sourceMappingURL=client.js.map
