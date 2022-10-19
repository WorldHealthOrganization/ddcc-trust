import { assemble } from '../src/did-doc-assembler.mjs'
import { expect } from 'chai'

describe('Assembler', function () {
  it('should assemble DID Document with single key', async function () {
    // Slovakia Test Keys from the EU DCC
    let wrappedJWKs = [
      {
        kid: "pgM4dDtABSg=",
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
    ];
    
    let expected = {
      "@context": [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1'
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
      ]
    }; 
    
    let result = assemble("did:web:example.com", wrappedJWKs);

    expect(result).to.eql(expected)
  })




  it('should assemble DID Document with 2 keys', async function () {
    // Slovakia Test Keys from the EU DCC
    let wrappedJWKs = [
      {
        kid: "K1.PATHCHECK.ORG",
        publicKeyJwk: {
          kty: "EC",
          x: "_PzeViu5gQyb4rNf4wZfyM2vLF4Fb4-fZFeIXXULUOs",
          y: "3hWerjTcKSqAZSn7IIqm1gUDGv79bjguWhxIWhhFue4",
          crv: "secp256k1"
        }
      }, 
      {
        kid: "K2.PATHCHECK.ORG",
        publicKeyJwk: {
          kty: "EC",
          x: "scKVHBa9ot_auW9t9OGMQh11udaqFikXXKmr-hpY4Ps",
          y: "rAK8IasD9HxsH_6Ohy7KkRzacrdQpjTvpdBHjQPSJe0",
          crv: "secp256k1"
        }
      }
    ];
    
    let expected = {
      "@context": [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1'
      ],
      id: 'did:web:example.com',
      verificationMethod: [
        {
          id: 'did:web:example.com#K1.PATHCHECK.ORG',
          type: 'JsonWebKey2020',
          controller: 'did:web:example.com',
          publicKeyJwk: {
            kty: "EC",
            x: "_PzeViu5gQyb4rNf4wZfyM2vLF4Fb4-fZFeIXXULUOs",
            y: "3hWerjTcKSqAZSn7IIqm1gUDGv79bjguWhxIWhhFue4",
            crv: "secp256k1"
          }
        }, 
        {
          id: 'did:web:example.com#K2.PATHCHECK.ORG',
          type: 'JsonWebKey2020',
          controller: 'did:web:example.com',
          publicKeyJwk: {
            kty: "EC",
            x: "scKVHBa9ot_auW9t9OGMQh11udaqFikXXKmr-hpY4Ps",
            y: "rAK8IasD9HxsH_6Ohy7KkRzacrdQpjTvpdBHjQPSJe0",
            crv: "secp256k1"
          }
        }
      ]
    }; 
    
    let result = assemble("did:web:example.com", wrappedJWKs);

    expect(result).to.eql(expected)
  })
})