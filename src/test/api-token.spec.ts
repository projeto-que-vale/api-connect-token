import {ApiToken, ApiTokenApplicationType, ApiTokenAuthContextType, ApiTokenProfileType} from '../api-token';
import {ApiTokenType} from '../../dist/src/api-token';

declare const test;
declare const expect;

let apiToken: ApiToken;
const token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHQiOiJzZXJ2ZXIiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDo0NjAwIl0sImNjdCI6ImFwcEB2ZWxvb2JyYXNpbC5jb20uYnIiLCJjaWQiOiJoSnRYSVoydVNONWtiUWZidFROV2JwZG1oa1Y4RkpHLU9uYmM2bXhDY1lnIiwiY3R4IjowLCJjbmEiOiJWZWxvbyBBUEkiLCJpYXQiOjE1OTUwMDI4MDIsImV4cCI6MTU5NzU5NDgwMiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0NjAwIiwibW9kIjpbImF1dGgiXSwicHJmIjo1LCJraWQiOiJCUFFoQTVna1VHS1NiWUt0cTlISU5XOVdfRzA2MWRWNjNHdndOQU5DVTRBIiwic3ViIjoiYWNjZXNzX3Rva2VuIiwidXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0NjAwIiwidWlkIjoiNGQzMWZjMGQ3ZTBjY2EyMjU4YmMxYjVhNzg3NWEyYzc5MDcyMjcyOCJ9.eMlWUkytSiSvC59Tp_awffKPLgRRpTeP53TLeLvofcw';

beforeAll(() => {
    apiToken = new ApiToken(token);
    console.log(apiToken);
    console.log('sssssssssssssssssssssssss');
    console.log(process.env.PASSWORD);
});

describe('ApiToken', () => {

    it('Verifica o tipo de aplicação (apt)', async () => {
        expect(apiToken.applicationType).toEqual('server');
        expect(apiToken.applicationType).toEqual(ApiTokenApplicationType.server);
    });

    it('Verifica as configurações de audiência (aud)', async () => {
        const expected: Array<string> = ['http://localhost:4600'];
        expect(apiToken.audience).toEqual(expect.arrayContaining(expected));
    });

    it('Verifica o contexto de autorização (ctx)', async () => {
        expect(apiToken.authContext).toEqual(0);
        expect(apiToken.authContext).toEqual(ApiTokenAuthContextType.noExpires);
    });

    it('Verifica o contato do cliente (cct)', async () => {
        expect(apiToken.clientContact).toEqual('app@veloobrasil.com.br');
    });

    it('Verifica o identificador do cliente (cid)', async () => {
        expect(apiToken.clientId).toEqual('hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg');
    });

    it('Verifica o nome do cliente (cna)', async () => {
        expect(apiToken.clientName).toEqual('Veloo API');
    });

    it('Verifica quando o token expira (exp)', async () => {
        const test: boolean = apiToken.expires >= apiToken.emission;
        expect(test).toEqual(true);
    });

    it('Verifica a uri do emissor (iss)', async () => {
        expect(apiToken.issuer).toEqual('http://localhost:4600');
    });

    it('Verifica os módulos que podem acessar (mod)', async () => {
        const expected: Array<string> = ['auth'];
        expect(apiToken.module).toEqual(expect.arrayContaining(expected));
    });

    it('Verifica o perfil do usuário (prf)', async () => {
        expect(apiToken.profile).toEqual(5);
        expect(apiToken.profile).toEqual(ApiTokenProfileType.server5);
    });

    /*it('Verifica se foi definido papel de usuário (role)', async () => {
        expect(apiToken.role).toEqual('operador');
    });*/

    /*it('Verifica se uma determinada ação/operação está presente no escopo de autorização (scope)', async () => {
        const regex: RegExp = new RegExp('read:cities', 'im');
        const test: boolean = regex.test(apiToken.scope);
        expect(test).toEqual(true);
    });*/

    it('Verifica o assunto do token (sub)', async () => {
        expect(apiToken.subject).toEqual('access_token');
        expect(apiToken.subject).toEqual(ApiTokenType.accessToken);
    });

    it('Verifica a uri de requisições (uri)', async () => {
        expect(apiToken.requestUri).toEqual('http://localhost:4600');
    });
});
