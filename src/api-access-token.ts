import { ApiTokenAbstract } from './api-token.abstract'
// @ts-ignore
import { ApiTokenOptionsInterface } from './api-token-interface'
import { ApiTokenType } from './api-token'

export class ApiAccessToken extends ApiTokenAbstract {
  constructor (options: ApiTokenOptionsInterface) {
    super(options)
    this.subject = ApiTokenType.accessToken
  }
}
