// import {JWK} from 'jose';
// @ts-ignore
import { ApiTokenPayloadInterface, ApiTokenRoleInterface } from './api-token-interface'

export enum ApiTokenAccessLevelType {
    public = 0,
    protected = 1,
    private = 2,
    confidence = 3,
    admin = 4,
    safe = 5,
}

export enum ApiTokenApplicationType {
    client = 'client',
    server = 'server'
}

// 0 = Não expira, 1 = Ultra Alto (<=30 dias) 2 = Alto (<=24hs), 3 = Normal (<=2hs), 4 = Baixo (<=1hs), 5 = Extra baixo(<=30min), 6 = Nonce (<=5min)
export enum ApiTokenAuthContextType {
    noExpires = 0,
    ultraHigh30days = 1,
    high24hours = 2,
    normal2hours = 3,
    low1hour = 4,
    ultraLow30min = 5,
    nonce1min = 6
}

export enum ApiTokenType {
    accessToken = 'access_token',
    authToken = 'auth_token',
    configToken = 'config_token',
    nonceToken = 'nonce_token',
    roleToken = 'role_token'
}

export enum ApiTokenProfileType {
    public0 = 0,
    guest1 = 1,
    userLogged2 = 2,
    role3 = 3,
    admin4 = 4,
    server5 = 5
}

// import OctKey = JWK.OctKey;

// const {JWK: {None, generateSync}, JWKS: {KeyStore, asKeyStore}, JWE, JWT} = require('jose');
const { JWT } = require('jose')

// const forge = require('node-forge');
// const pki = forge.pki;

export class ApiToken {
    public applicationType: ApiTokenApplicationType | string; // apt
    public audience: Array<string>; // aud
    /**
     * Indica o contexto do tempo de vida útil do token
     * 0 = Ultra Alto (<=30 dias) 1 = Alto (<=24hs), 2 = Normal (<=6hs), 3 = Baixo (<=1hs), 4 = Extra baixo(<=30min), 5 = Instante (<=1min)
     */
    public authContext: ApiTokenAuthContextType | number; // ctx
    public clientContact: string; // cct
    public clientId: string; // cid
    public clientName: string; // cna
    public emission: number; // Hora de emissão do token //iat
    public expires: number; // exp
    public issuer: string; // iss
    public module: Array<string>; // mod
    /**
     * 0 = guest, 1 = user, 2 = admin, 3 = role, 4 = developer, 5 = server
     */
    public profile: ApiTokenProfileType | number; // prf
    public privateKey: any;
    public privateKeyId: string; // kid
    public role: ApiTokenRoleInterface; // role
    public scope: string; // scope
    public subject: ApiTokenType | string; // sub
    public requestUri: string; // uri
    public uid: string;

    constructor (public token: string) {
      this._config()
    }

    /* private _isValid: boolean = false;

    public get isValid(): boolean {
        return this._isValid && this._isValidAudience;
    }

    public get _isValidAudience(): boolean {
        let isValidAudience: boolean = false;
        this.audience.forEach((item) => {
            /!*if (ApiModuleManager.exists(item)) {
                isValidAudience = true;
            }*!/
        });
        return isValidAudience;
    } */

    public static authorization (value: string): ApiToken {
      if (value.startsWith('Bearer ')) {
        value = value.slice(7, value.length)
      }
      return new ApiToken(value)
    }

    public hasScope (value: string): boolean {
      const regex: RegExp = new RegExp(value, 'im')
      return regex.test(this.scope)
    }

    private _config () {
      try {
        const payload: ApiTokenPayloadInterface = JWT.decode(this.token)
        if (payload) {
          this.applicationType = payload.apt
          this.audience = payload.aud
          this.authContext = payload.ctx
          this.clientContact = payload.cct
          this.clientId = payload.cid
          this.clientName = payload.cna
          this.emission = payload.iat
          this.expires = payload.exp
          this.issuer = payload.iss
          this.module = payload.mod
          this.uid = payload.uid

          this.profile = payload.prf
          this.privateKeyId = payload.kid
          this.role = payload.role
          this.scope = payload.scope
          this.subject = payload.sub
          this.requestUri = payload.uri

          /* const key = JWK.asKey({kty: 'oct', k: this.uid});
                this._isValid = JWT.verify(this.token, key, {
                    uri: 'http://localhost:4600',
                }); */
        }
      } catch (e) {
      }
    }
}
