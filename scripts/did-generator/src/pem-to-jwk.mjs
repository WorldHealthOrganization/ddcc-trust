import { Certificate, PublicKey } from '@fidm/x509'
import { createPublicKey } from "crypto"

function cleanPEM(pem) {
  return pem.replace("-----BEGIN CERTIFICATE-----", "")
            .replace("-----END CERTIFICATE-----", "")
            .replace(/\n/g, "").replace(/\r/g, "")
}

function isSelfSigned(cert) {
  return cert.subjectKeyIdentifier == cert.authorityKeyIdentifier
}

function findChain(pem, certDictBySKI) {
  let cert = Certificate.fromPEM(pem);
  let x5c = [cleanPEM(pem)];

  if (cert.authorityKeyIdentifier && !isSelfSigned(cert)) {
    // if it is not self signed
    if (cert.authorityKeyIdentifier in certDictBySKI) {
      x5c.push(...findChain(certDictBySKI[cert.authorityKeyIdentifier], certDictBySKI))
    } 
  }

  return x5c;
}

/**
 * Turns a list of certificates into a map subjectKeyIdentifier 
 */
export function mapBySKI(certs) {
  let certMap = {}
  certs.forEach((pem) => {
    try {
      let ski = Certificate.fromPEM(pem).subjectKeyIdentifier
      if (ski)
        certMap[ski] = pem
    } catch {
      console.log("Could not process " + pem)
    }
  })
  return certMap;
}

/**
 * Transforms the PEM content in a JWK. 
 * 
 * pem: PEM file contents
 * certDictBySKI: A dict/map of all known certificates by SubjectKeyIdentifier (Certificate.fromPEM(pem).subjectKeyIdentifier)
 */
export function pemToJwk(pem, certDictBySKI) {
  if (pem.includes("CERTIFICATE")) {
    let jwk = createPublicKey(pem).export({format: 'jwk'});
    jwk['x5c'] = findChain(pem, certDictBySKI)
    return jwk;
  } else if (pem.includes("PUBLIC KEY")) {
    return createPublicKey(pem).export({format: 'jwk'});
  } else {
    console.log("Unable to parse PEM:\n" + pem) 
    return "";
  }
}