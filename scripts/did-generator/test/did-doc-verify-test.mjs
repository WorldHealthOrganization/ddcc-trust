import { assemble } from '../src/did-doc-assembler.mjs'
import { sign } from '../src/did-doc-signer.mjs'
import { verify } from '../src/did-doc-verifier.mjs'
import { expect } from 'chai'

describe('Verifier', function () {
  it('should verify DID Document', async function () {

    let signedDidDocument = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1'
      ],
      id: 'did:web:example.com',
      verificationMethod: [
        {
          id: 'did:web:example.com#pgM4dDtABSg%3D',
          type: 'JsonWebKey2020',
          controller: 'did:web:example.com',
          publicKeyJwk: {
            kty: "EC",
            x: "W6fufxhi1gBb42JIEHwd-f4dhypR0w8kDHgW_x-JZgM",
            y: "edi69EIE9dSi3M7nHN_LUyBpTwPxeOW5korwH1niVB4",
            crv: "P-256",
            x5c: [
              "MIICajCCAg+gAwIBAgIUeaYSSkOcHR3GBZGu05DD2puHYMkwCgYIKoZIzj0EAwIwczELMAkGA1UEBhMCU0sxCzAJBgNVBAgMAlNLMRMwEQYDVQQHDApCcmF0aXNsYXZhMQ0wCwYDVQQKDAROQ1pJMRYwFAYDVQQLDA1ER0NPcGVyYXRpb25zMRswGQYDVQQDDBJDU0NBX0RHQ19TS19ERVZfMDEwHhcNMjEwNTEzMDkzNTExWhcNMjMwNTEzMDkzNTExWjBrMQswCQYDVQQGEwJTSzELMAkGA1UECAwCU0sxEzARBgNVBAcMCkJyYXRpc2xhdmExDTALBgNVBAoMBE5DWkkxFjAUBgNVBAsMDURHQ09wZXJhdGlvbnMxEzARBgNVBAMMCkRTQ19ERVZfMDEwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAARbp+5/GGLWAFvjYkgQfB35/h2HKlHTDyQMeBb/H4lmA3nYuvRCBPXUotzO5xzfy1MgaU8D8XjluZKK8B9Z4lQeo4GIMIGFMA4GA1UdDwEB/wQEAwIHgDAdBgNVHQ4EFgQUylpQRPe2WiVsqVSSUp55fJxhsJcwHwYDVR0jBBgwFoAURKsCMOj8Q/LO56rPkMpmqJrmUSgwMwYDVR0lBCwwKgYMKwYBBAEAjjePZQEBBgwrBgEEAQCON49lAQIGDCsGAQQBAI43j2UBAzAKBggqhkjOPQQDAgNJADBGAiEAr8s4wtjbyUZZSf8hzglA6nSg99rcuezHQbAyQbxrTz0CIQCOcoI6AxajIMuYgNu/DXXWR0rXqSMLJ2cEYoSZ18oWvg=="
            ]
          }
        }
      ],
      proof: {
        type: 'Ed25519Signature2020',
        created: '2022-10-18T21:23:07Z',
        verificationMethod: 'did:web:PCF.PW:1A13#WEB',
        proofPurpose: 'assertionMethod',
        proofValue: 'z4bsMTpR97zQHEMUzfNgX4Sbz82rbVvQenQyHj6anZP8tc7Br1KaQQkxjQAUqGHtkDYMSqvDnqVYqpY8oAJnUqWgM'
      }
    };

    const keyPair = {
      "id": "did:web:PCF.PW:1A13#WEB",
      "controller": "did:web:PCF.PW:1A13",
      "type": "Ed25519VerificationKey2020",
      "publicKeyMultibase": "z6MksttRwLREud56E3ZHpUEDntm9aN9fdYvX6kY2a2gNjH5h",
      "privateKeyMultibase": "zrv4W86GX8Qq6ukrxEZwvB562MG7jcMqdSo1H37bMeYYAE1NQL2ygTPiuF4L4ZQdDLQfAkRYNVB6LJh2rzonPsnUS7h"
    }

    let result = await verify(signedDidDocument)

    expect(result.verified).to.be.true
  })
})