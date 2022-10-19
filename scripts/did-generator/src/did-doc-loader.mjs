import jsonld from "jsonld";
import { resolve } from '@pathcheck/did-web-resolver'

const documentLoader = jsonld.documentLoaders.node();

let cache = {}

/**
 * didDocument: the didDocument to sign
 * privateKey: private key for the signer
 * 
 * wrappedJwk {
 *   kid: ID as used in the QR Code Spec
 *   publicKeyJwk: JWK object as defined by https://www.w3.org/community/reports/credentials/CG-FINAL-lds-jws2020-20220721/
 * }
 */
export async function loader(url) {
  if (cache[url]) {
    return cache[url]
  }

  if (url.startsWith("did:web")) {
    const document = await resolve(url);
    if (document.didResolutionMetadata.error) {
      console.log(document.didResolutionMetadata.error, document.didResolutionMetadata.message);
    }
    const result = {
      url,
      document: document.didDocument,
      static: true
    }
    cache[url] = result
    return result
  }
  const result = documentLoader(url);
  cache[url] = result
  return result
}
