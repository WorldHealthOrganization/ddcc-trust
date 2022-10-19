import { loader } from '../src/did-doc-loader.mjs'
import { expect } from 'chai'

describe('Loader', function () {
  it('should resolve DID WEB', async function () {
    let result = await loader("did:web:raw.githubusercontent.com:Path-Check:trust-registry:main:signer#WEB")
    let expected = {
      "document": {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1"
        ],
        "controller": "did:web:raw.githubusercontent.com:Path-Check:trust-registry:main:signer",
        "id": "did:web:raw.githubusercontent.com:Path-Check:trust-registry:main:signer#WEB",
        "publicKeyMultibase": "z6MkkQRSRnwoZbR5rmZKvNkvpjawFQH8FCZi1G1FKKHT5sub",
        "type": "Ed25519VerificationKey2020",
      },
      "static": true,
      "url": "did:web:raw.githubusercontent.com:Path-Check:trust-registry:main:signer#WEB"
    }

    expect(result).to.eql(expected)
  })
})