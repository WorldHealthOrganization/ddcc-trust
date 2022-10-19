import fs from 'fs';
import jsigs from 'jsonld-signatures';
import {Ed25519VerificationKey2020} from '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020, suiteContext} from '@digitalbazaar/ed25519-signature-2020';
import jsonld from "jsonld";
const {purposes: {AssertionProofPurpose}} = jsigs;

import { loader } from './did-doc-loader.mjs'

/**
 * signedDocument: signed did document to verify
 */
export async function verify(signedDocument) {
  let keyID = signedDocument.proof.verificationMethod

  const signerController = {
    '@context': 'https://w3id.org/security/v3-unstable', 
    assertionMethod: [keyID],
    authentication: [keyID]
  };

  const result = await jsigs.verify(signedDocument, {
    documentLoader: loader,
    suite: new Ed25519Signature2020(),
    purpose: new AssertionProofPurpose({ controller: signerController })
  });
  
  return result
}

