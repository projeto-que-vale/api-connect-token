import { JWK, JWKOctKey } from 'jose'
import {
  ApiTokenApplicationType,
  ApiTokenAuthContextType,
  ApiTokenProfileType,
  ApiTokenType
} from './api-token'
// @ts-ignore
import { ApiTokenOptionsInterface, ApiTokenPayloadInterface, ApiTokenRoleInterface } from './api-token-interface'
import OctKey = JWK.OctKey;

const { JWK: { generateSync }, JWT } = require('jose')

export abstract class ApiTokenAbstract {
    public applicationType: ApiTokenApplicationType | string; // apt
    public audience: Array<string>; // aud
    /**
     * Indica o contexto do tempo de vida útil do token
     * 0 = Ultra Alto (<=30 dias) 1 = Alto (<=24hs), 2 = Normal (<=6hs), 3 = Baixo (<=1hs), 4 = Extra baixo(<=30min), 5 = Instante (<=1min)
     */
    public authContext: ApiTokenAuthContextType | number = ApiTokenAuthContextType.normal2hours; // ctx
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
    public profile: ApiTokenProfileType | number = ApiTokenProfileType.guest1; // prf
    public privateKey: JWKOctKey;
    public privateKeyId: string; // kid
    public role: ApiTokenRoleInterface; // role
    public scope: string; // scope
    public subject: ApiTokenType | string; // sub
    public requestUri: string; // uri
    public uid: string | undefined;
    private _octKey: OctKey | undefined;

    constructor (options: ApiTokenOptionsInterface) {
      this._generate(options)
    }

    public get payload (): ApiTokenPayloadInterface {
      return {
        apt: this.applicationType,
        aud: this.audience,
        cct: this.clientContact,
        cid: this.clientId,
        ctx: this.authContext,
        cna: this.clientName,
        iat: this.emission,
        exp: this.expires,
        iss: this.issuer,
        mod: this.module,
        prf: this.profile,
        kid: this.privateKeyId,
        role: this.role,
        scope: this.scope,
        sub: this.subject,
        uri: this.requestUri,
        uid: this.uid
      }
    }

    public _generate (options: ApiTokenOptionsInterface): void {
      for (const index in options) {
        this[index] = options[index]
      }
      this._generateSync()
      // this.emission = ApiUtil.createdAt();
      this._expires()
    }

    public get data (): any {
      return { input: { uid: this.uid, emission: this.emission, expires: this.expires, privateKey: this.privateKey } }
    }

    public get token ():string {
      return JWT.sign(this.payload, this._octKey.toJWK(true), { header: { typ: 'JWT' } })
    }

    private _generateSync () {
      this._octKey = generateSync('oct')
      this.privateKeyId = this._octKey.kid
      this.privateKey = this._octKey.toJWK(true)
      // this.uid = ApiSecurity.sha1(this.clientId + this.privateKey.k);
    }

    private _expires () {
      // const MINUTES: number = 60;

      switch (this.authContext) {
        case ApiTokenAuthContextType.ultraHigh30days:
          // this.expires = ApiUtil.expireAt(30 * (24 * MINUTES));
          break
        case ApiTokenAuthContextType.high24hours:
          // this.expires = ApiUtil.expireAt(24 * MINUTES);
          break
        case ApiTokenAuthContextType.normal2hours:
          // this.expires = ApiUtil.expireAt(6 * MINUTES);
          break
        case ApiTokenAuthContextType.low1hour:
          // this.expires = ApiUtil.expireAt(MINUTES);
          break
        case ApiTokenAuthContextType.ultraLow30min:
          // this.expires = ApiUtil.expireAt((30));
          break
        case ApiTokenAuthContextType.nonce1min:
        default:
          // this.expires = ApiUtil.expireAt((1));
          break
      }
    }
}
