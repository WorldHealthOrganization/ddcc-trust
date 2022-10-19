import { pemToJwk, mapBySKI } from '../src/pem-to-jwk.mjs'
import { expect } from 'chai'

describe('PEM-to-JWK', function () {
  it('should convert simple Certificate', async function () {
    // Singapore Cert
    let result = pemToJwk(
      `-----BEGIN CERTIFICATE-----
MIICUzCCAfmgAwIBAgIUG+Ttk4nCDYn2RtZ9AZA1YnUSM0IwCgYIKoZIzj0EAwIw
azELMAkGA1UEBhMCU0cxEjAQBgNVBAgMCVNpbmdhcG9yZTElMCMGA1UECgwcR292
ZXJubWVudCBUZWNobm9sb2d5IEFnZW5jeTEhMB8GA1UEAwwYY3NjYS13aG8uZGV2
Lm5vdGFyaXNlLmlvMB4XDTIyMDYxNDE0MTQwOFoXDTI0MDYxMzE0MTQwOFowWzEL
MAkGA1UEBhMCU0cxEjAQBgNVBAgMCVNpbmdhcG9yZTEbMBkGA1UECgwSTWluaXN0
cnkgb2YgSGVhbHRoMRswGQYDVQQDDBJkc2MuZGV2Lm1vaC5nb3Yuc2cwWTATBgcq
hkjOPQIBBggqhkjOPQMBBwNCAATbkbFbLkw58lcEnuY+aX4sCzVfJJOKexj99Ae2
6Wk3aQvZnjRVjNeCuly1rceh6kRx9napHUfQ6XtL3psocHvJo4GKMIGHMA4GA1Ud
DwEB/wQEAwIHgDAdBgNVHQ4EFgQUQ4QH9HVgXjuKD6dzN69YDDTaNNcwHwYDVR0j
BBgwFoAUlnGGH+oqAY+y0x6GIv51+mjMr/0wNQYDVR0fBC4wLDAqoCigJoYkaHR0
cHM6Ly9kZXYubm90YXJpc2UuaW8vY3NjYS13aG8uY3JsMAoGCCqGSM49BAMCA0gA
MEUCIBJhOf7HP8hRwUoDBVPnqXYHN0IZh2Be65wwai3u5VDWAiEAtwfjGyG51R03
I9RzZuwuh4Q/iTP7FfkPpREj7MF9Aq4=
-----END CERTIFICATE-----
`, {})
    
    let expected = {
      kty: 'EC',
      x: '25GxWy5MOfJXBJ7mPml-LAs1XySTinsY_fQHtulpN2k',
      y: 'C9meNFWM14K6XLWtx6HqRHH2dqkdR9Dpe0vemyhwe8k',
      crv: 'P-256',
      x5c: [
        'MIICUzCCAfmgAwIBAgIUG+Ttk4nCDYn2RtZ9AZA1YnUSM0IwCgYIKoZIzj0EAwIwazELMAkGA1UEBhMCU0cxEjAQBgNVBAgMCVNpbmdhcG9yZTElMCMGA1UECgwcR292ZXJubWVudCBUZWNobm9sb2d5IEFnZW5jeTEhMB8GA1UEAwwYY3NjYS13aG8uZGV2Lm5vdGFyaXNlLmlvMB4XDTIyMDYxNDE0MTQwOFoXDTI0MDYxMzE0MTQwOFowWzELMAkGA1UEBhMCU0cxEjAQBgNVBAgMCVNpbmdhcG9yZTEbMBkGA1UECgwSTWluaXN0cnkgb2YgSGVhbHRoMRswGQYDVQQDDBJkc2MuZGV2Lm1vaC5nb3Yuc2cwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATbkbFbLkw58lcEnuY+aX4sCzVfJJOKexj99Ae26Wk3aQvZnjRVjNeCuly1rceh6kRx9napHUfQ6XtL3psocHvJo4GKMIGHMA4GA1UdDwEB/wQEAwIHgDAdBgNVHQ4EFgQUQ4QH9HVgXjuKD6dzN69YDDTaNNcwHwYDVR0jBBgwFoAUlnGGH+oqAY+y0x6GIv51+mjMr/0wNQYDVR0fBC4wLDAqoCigJoYkaHR0cHM6Ly9kZXYubm90YXJpc2UuaW8vY3NjYS13aG8uY3JsMAoGCCqGSM49BAMCA0gAMEUCIBJhOf7HP8hRwUoDBVPnqXYHN0IZh2Be65wwai3u5VDWAiEAtwfjGyG51R03I9RzZuwuh4Q/iTP7FfkPpREj7MF9Aq4='
      ]
    }

    expect(result).to.eql(expected)
  })

  it('should convert simple PublicKey', async function () {
    // PathCheck Keys
    let result = pemToJwk(
      `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE6DeIun4EgMBLUmbtjQw7DilMJ82YIvOR2jz/IK0R/F7/zXY1z+gqvFXfDcJqR5clbAYlO9lHmvb4lsPLZHjugQ==
-----END PUBLIC KEY-----`, {})
    
    let expected = {
      kty: 'EC',
      x: "6DeIun4EgMBLUmbtjQw7DilMJ82YIvOR2jz_IK0R_F4",
      y: "_812Nc_oKrxV3w3CakeXJWwGJTvZR5r2-JbDy2R47oE",
      crv: 'secp256k1'
    }

    expect(result).to.eql(expected)
  })


  it('should convert certificate chain', async function () {
    // Tunisia's EU keys
    let pem = "-----BEGIN CERTIFICATE-----\nMIIDNzCCAr2gAwIBAgIIYiieSCBJd0kwCgYIKoZIzj0EAwIwYTEZMBcGA1UEAwwQQ1NDQSBUVU5JU0lBIERHQzE3MDUGA1UECgwuQUdFTkNFIE5BVElPTkFMRSBERSBDRVJUSUZJQ0FUSU9OIEVMRUNUUk9OSVFVRTELMAkGA1UEBhMCVE4wHhcNMjIwNTMwMTMzMjAzWhcNMjQwNTI5MTMzMjAzWjCBjTE+MDwGA1UEAww1Q0VOVFJFIElORk9STUFUSVFVRSBEVSBNSU5JU1RFUkUgREUgTEEgU0FOVEUgUFVCTElRVUUxPjA8BgNVBAoMNUNFTlRSRSBJTkZPUk1BVElRVUUgRFUgTUlOSVNURVJFIERFIExBIFNBTlRFIFBVQkxJUVVFMQswCQYDVQQGEwJUTjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFN3CWIifutbplcsvzDQ7p+/lxyevW+0/8MGeHPITL0b/pPgbmY7AU1x9jggALvHqObNvqzZROduaCp132o7N2GjggEwMIIBLDBEBggrBgEFBQcBAQQ4MDYwNAYIKwYBBQUHMAKGKGh0dHA6Ly93d3cudHVudHJ1c3QudG4vcHViL2NzY2F0bmRnYy5jcnQwHQYDVR0OBBYEFKm9PrB2aZKMok0wbSi0ld4a4KUEMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAULdK7qdtkFRz6ipkr7j8rdRdcMlowGgYDVR0QBBMwEYEPMjAyMjExMjcxMzMyMDNaMDUGA1UdHwQuMCwwKqAooCaGJGh0dHA6Ly93d3cudHVudHJ1c3QudG4vY3NjYXRuZGdjLmNybDAOBgNVHQ8BAf8EBAMCB4AwMwYDVR0lBCwwKgYMKwYBBAEAjjePZQEDBgwrBgEEAQCON49lAQEGDCsGAQQBAI43j2UBAjAKBggqhkjOPQQDAgNoADBlAjEA89B9vAnfxmkOILC+gGCFYUHY8NZwwjkLPKt4T2cStGuuWSuxpIr4yxkfpCvT4RxcAjA04MqqgcTUYrERrVzDZARWWM3SN8uWjrLJCbJJX0HwwibIV4XQiFl8yp6qajtonEg=\n-----END CERTIFICATE-----";
    
    let allMyCerts = [ // First one is Tunisia's root 
      "-----BEGIN CERTIFICATE-----\nMIICeTCCAf+gAwIBAgIIccWj0Ru0h5gwCgYIKoZIzj0EAwIwYTEZMBcGA1UEAwwQQ1NDQSBUVU5JU0lBIERHQzE3MDUGA1UECgwuQUdFTkNFIE5BVElPTkFMRSBERSBDRVJUSUZJQ0FUSU9OIEVMRUNUUk9OSVFVRTELMAkGA1UEBhMCVE4wHhcNMjEwOTEwMDkxNzE3WhcNMjUwOTEwMDkxNzE3WjBhMRkwFwYDVQQDDBBDU0NBIFRVTklTSUEgREdDMTcwNQYDVQQKDC5BR0VOQ0UgTkFUSU9OQUxFIERFIENFUlRJRklDQVRJT04gRUxFQ1RST05JUVVFMQswCQYDVQQGEwJUTjB2MBAGByqGSM49AgEGBSuBBAAiA2IABMNBYoypdNCvzws2kJJBxrHq+lnkzikK54bCLQxZV3S+bJZyvlU3eomDpGZJJ40snGBIxWQo8asrKDUycJDUQZMUgT/0+mKqdX/v2z/Zpfb1XRk0SS4UAwhidrqpE/QXJaOBgzCBgDAdBgNVHQ4EFgQULdK7qdtkFRz6ipkr7j8rdRdcMlowEgYDVR0TAQH/BAgwBgEB/wIBADAfBgNVHSMEGDAWgBQt0rup22QVHPqKmSvuPyt1F1wyWjAaBgNVHRAEEzARgQ8yMDIyMDkxMDA5MTcxN1owDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMCA2gAMGUCMBHybnt8tLcEt/ZgFG08NHeMZDsrcVg5yYaUpsrn0aTjKmqHF5AZ+ClfGipFGJucbAIxAKTRXUR3wqG+2bl0LxUCf6rLKfs1j4bo6VL7EiAvbp4JWwYxwjp5Dzam4yTFqJs/oQ==\n-----END CERTIFICATE-----",
      "-----BEGIN CERTIFICATE-----\n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\n-----END CERTIFICATE-----",
      "-----BEGIN CERTIFICATE-----\n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\n-----END CERTIFICATE-----",
      "-----BEGIN CERTIFICATE-----\nMIIH7DCCBdSgAwIBAgICMRswDQYJKoZIhvcNAQELBQAwZTELMAkGA1UEBhMCQVUxDDAKBgNVBAoMA0dPVjENMAsGA1UECwwEREZBVDEMMAoGA1UECwwDUFRCMSswKQYDVQQDDCJQYXNzcG9ydCBDb3VudHJ5IFNpZ25pbmcgQXV0aG9yaXR5MB4XDTEzMTExODAwMDE1NVoXDTI5MTExNzIzNTYwNlowZTELMAkGA1UEBhMCQVUxDDAKBgNVBAoMA0dPVjENMAsGA1UECwwEREZBVDEMMAoGA1UECwwDUFRCMSswKQYDVQQDDCJQYXNzcG9ydCBDb3VudHJ5IFNpZ25pbmcgQXV0aG9yaXR5MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAw+QzaMU+DpemI4CpHnpCF0pnIKI/M9JenO9UBKMIYim9LOPnx/1mZOqvENoGudAWfKzKqdBc4Z00NHObKZw1HPATYatKFzoHAdfEWsoURk3wps4RHNjwHygwtPRMyHVtP5FwlKM6jILt/qgpS3pzYNMieLo7FIC1TpcSTEdtwVGR/bAsL/Ts8mjQfMX731L6s3/BJgOR0Ng1GvvETjOPQ9KfIWynvWqCHmQ0BZHDysHMbafMSl8V34A1nqsmtCkYFXr8ZZTUmzey4dwqgSIO1gQR2lGCssBVFktz1tjLv4o0VKgf8X0MJL6TASakK72fe9aM3Ghia+6pEf3mmMBvartA4Y44CoOuK2/RqV9fjJoB7BiDCSupcNDY54xlpIrGBEyD2Veyh5JwUB3ahGvN4X4QfweQKS/bwJbGcD1Q8b414fU9H+LrRe235XH63rLMONmCidk0Hpi37T7NecFhMQwLlxvwWqJhej5qZSD9z+g7L1NN5n8vxn3oGSOuu3ylKNmIekdz0aOU3eSorzFd1h49aT59R4z7e3lPfO6ChLiED36BtBbtYORFtPV7vTjG7WjhbUE/e/ZQwfKsBqOzKv/vUey+0e2x4ljI023IHkehut7Ylq2tctORrDjyEsQJR+dbqdqnp/u4dNVS7gi9Rn8+NygCA8JyP1B16gKp8IkCAwEAAaOCAqQwggKgMBIGA1UdEwEB/wQIMAYBAf8CAQAwgfEGA1UdIASB6TCB5jCB4wYIKiSfpoFdAQEwgdYwgdMGCCsGAQUFBwICMIHGDIHDQ2VydGlmaWNhdGVzIHVuZGVyIHRoaXMgcG9saWN5IGFyZSBpc3N1ZWQgYnkgdGhlIERGQVQgQ291bnRyeSBTaWduaW5nIENBIHRvIHRoZSBDb3VudHJ5IFNpZ25pbmcgQ0EgaXRzZWxmIChzZWxmLXNpZ25lZCkgb3IgdGhlIERvY3VtZW50IFNpZ25pbmcgQ2VydGlmaWNhdGVzIHN1Ym9yZGluYXRlIHRvIHRoZSBDb3VudHJ5IFNpZ25pbmcgQ0EuMBsGA1UdEQQUMBKkEDAOMQwwCgYDVQQHDANBVVMwbQYDVR0fBGYwZDAwoC6gLIYqaHR0cHM6Ly9wa2Rkb3dubG9hZDEuaWNhby5pbnQvQ1JMcy9BVVMuY3JsMDCgLqAshipodHRwczovL3BrZGRvd25sb2FkMi5pY2FvLmludC9DUkxzL0FVUy5jcmwwDgYDVR0PAQH/BAQDAgEGMCsGA1UdEAQkMCKADzIwMTMxMTE3MjM1NjA1WoEPMjAxNzExMTcyMzU2MDVaMBsGA1UdEgQUMBKkEDAOMQwwCgYDVQQHDANBVVMwHQYDVR0OBBYEFEmxQpvzh8zKmYCiRYMRV6NfRQWYMIGQBgNVHSMEgYgwgYWAFEmxQpvzh8zKmYCiRYMRV6NfRQWYoWmkZzBlMQswCQYDVQQGEwJBVTEMMAoGA1UECgwDR09WMQ0wCwYDVQQLDARERkFUMQwwCgYDVQQLDANQVEIxKzApBgNVBAMMIlBhc3Nwb3J0IENvdW50cnkgU2lnbmluZyBBdXRob3JpdHmCAjEbMA0GCSqGSIb3DQEBCwUAA4ICAQBIP1/iSU3r2QvdEyxBsMm0Dre9PGH6qGdHraiznhyQBrcKGGZIzhxZhuqq3lBkW3Qult5igbYB6CxZjlr0A+KVGdfym4oo137HGrUwqDOJSpSBPt1r3A2x2U3xJljQgUPJwXzk3ScdHg1116Xbn6mRf4IcTxxdw6V5tjcOnQW69cqBQQvOioUQWstVe+PnfBwO7bVdll/WMY0UGkqFoMT65KYzUDsOdFfYe+4z1qe8IAW9rBaouAVnzN6QhPu0gceFqjlrcyN83+ITNxu052XhY4LisUJK7ZIzQgCM4aqKjgpmm5SUQ9QDP7f2/Afpf0privYsfto9wdDXXthGvShFU3FEcoaPLYr+w0ZtIfuzLwqrZkTcIdSdAvS6DSAqxhRsdy9ovvqGxzfFnoKoJX3p/fmCERPh07u7IIt8lBLWR1a8nkodMcWu4Lrc5++xWTsYXRur/ol7ysLLcpFF8uTNBY2dnWwj5/8EzQ9a9Iqxbkrfa9MD6gmpPjITfp+0Si6grlRBy0lOZ5Gn48i7SEtO70PHpdWq+yyFt92ZNxgDKIOn/eU54vyta9dsphKnJ7va4JUkaaY25j3nKHCF9av2PLJ2EB3eZE+eRKiRkT7ZKgZpNckljN9/xLZ13WTdPVxZFvoMqdcxuNFT+6dFsQvFIbLgPsoTkLmE+DJr4MV17Q==\n-----END CERTIFICATE-----"
    ];

    let result = pemToJwk(pem, mapBySKI(allMyCerts))
    
    let expected = {
      "kty": "EC",
      "x": "U3cJYiJ-61umVyy_MNDun7-XHJ69b7T_wwZ4c8hMvRs",
      "y": "_pPgbmY7AU1x9jggALvHqObNvqzZROduaCp132o7N2E",
      "crv": "P-256",
      "x5c": [
        "MIIDNzCCAr2gAwIBAgIIYiieSCBJd0kwCgYIKoZIzj0EAwIwYTEZMBcGA1UEAwwQQ1NDQSBUVU5JU0lBIERHQzE3MDUGA1UECgwuQUdFTkNFIE5BVElPTkFMRSBERSBDRVJUSUZJQ0FUSU9OIEVMRUNUUk9OSVFVRTELMAkGA1UEBhMCVE4wHhcNMjIwNTMwMTMzMjAzWhcNMjQwNTI5MTMzMjAzWjCBjTE+MDwGA1UEAww1Q0VOVFJFIElORk9STUFUSVFVRSBEVSBNSU5JU1RFUkUgREUgTEEgU0FOVEUgUFVCTElRVUUxPjA8BgNVBAoMNUNFTlRSRSBJTkZPUk1BVElRVUUgRFUgTUlOSVNURVJFIERFIExBIFNBTlRFIFBVQkxJUVVFMQswCQYDVQQGEwJUTjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFN3CWIifutbplcsvzDQ7p+/lxyevW+0/8MGeHPITL0b/pPgbmY7AU1x9jggALvHqObNvqzZROduaCp132o7N2GjggEwMIIBLDBEBggrBgEFBQcBAQQ4MDYwNAYIKwYBBQUHMAKGKGh0dHA6Ly93d3cudHVudHJ1c3QudG4vcHViL2NzY2F0bmRnYy5jcnQwHQYDVR0OBBYEFKm9PrB2aZKMok0wbSi0ld4a4KUEMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAULdK7qdtkFRz6ipkr7j8rdRdcMlowGgYDVR0QBBMwEYEPMjAyMjExMjcxMzMyMDNaMDUGA1UdHwQuMCwwKqAooCaGJGh0dHA6Ly93d3cudHVudHJ1c3QudG4vY3NjYXRuZGdjLmNybDAOBgNVHQ8BAf8EBAMCB4AwMwYDVR0lBCwwKgYMKwYBBAEAjjePZQEDBgwrBgEEAQCON49lAQEGDCsGAQQBAI43j2UBAjAKBggqhkjOPQQDAgNoADBlAjEA89B9vAnfxmkOILC+gGCFYUHY8NZwwjkLPKt4T2cStGuuWSuxpIr4yxkfpCvT4RxcAjA04MqqgcTUYrERrVzDZARWWM3SN8uWjrLJCbJJX0HwwibIV4XQiFl8yp6qajtonEg=",
        "MIICeTCCAf+gAwIBAgIIccWj0Ru0h5gwCgYIKoZIzj0EAwIwYTEZMBcGA1UEAwwQQ1NDQSBUVU5JU0lBIERHQzE3MDUGA1UECgwuQUdFTkNFIE5BVElPTkFMRSBERSBDRVJUSUZJQ0FUSU9OIEVMRUNUUk9OSVFVRTELMAkGA1UEBhMCVE4wHhcNMjEwOTEwMDkxNzE3WhcNMjUwOTEwMDkxNzE3WjBhMRkwFwYDVQQDDBBDU0NBIFRVTklTSUEgREdDMTcwNQYDVQQKDC5BR0VOQ0UgTkFUSU9OQUxFIERFIENFUlRJRklDQVRJT04gRUxFQ1RST05JUVVFMQswCQYDVQQGEwJUTjB2MBAGByqGSM49AgEGBSuBBAAiA2IABMNBYoypdNCvzws2kJJBxrHq+lnkzikK54bCLQxZV3S+bJZyvlU3eomDpGZJJ40snGBIxWQo8asrKDUycJDUQZMUgT/0+mKqdX/v2z/Zpfb1XRk0SS4UAwhidrqpE/QXJaOBgzCBgDAdBgNVHQ4EFgQULdK7qdtkFRz6ipkr7j8rdRdcMlowEgYDVR0TAQH/BAgwBgEB/wIBADAfBgNVHSMEGDAWgBQt0rup22QVHPqKmSvuPyt1F1wyWjAaBgNVHRAEEzARgQ8yMDIyMDkxMDA5MTcxN1owDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMCA2gAMGUCMBHybnt8tLcEt/ZgFG08NHeMZDsrcVg5yYaUpsrn0aTjKmqHF5AZ+ClfGipFGJucbAIxAKTRXUR3wqG+2bl0LxUCf6rLKfs1j4bo6VL7EiAvbp4JWwYxwjp5Dzam4yTFqJs/oQ=="
      ]
    }

    expect(result).to.eql(expected)
  })
})
