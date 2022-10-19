import fs from 'fs';
import jsigs from 'jsonld-signatures';
import {Ed25519VerificationKey2020} from '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020, suiteContext} from '@digitalbazaar/ed25519-signature-2020';
import jsonld from "jsonld";
const {purposes: {AssertionProofPurpose}} = jsigs;

import { loader } from './did-doc-loader.mjs'

/**
 * didDocument: the didDocument to sign
 * keyPairData = {
      id: 'did:web:PCF.PW:1A12#WEB',
      type: 'Ed25519VerificationKey2020',
      controller: 'did:web:PCF.PW:1A12',
      publicKeyMultibase: 'zGhTGvJH58518mWd5PAWnAVLx3dArnmQNmPqhhqmhuEsz',
      privateKeyMultibase: 'z5Q2WLLaD7aJ44s6Aw6qXf1vNor9quCe1ZLhHqc63yhfFF63tbuTgPHgCzXKUbkHAGm8oE9jiQpCPepD88Jgyy7FW',
    }
 */
export async function sign(didDocument, keyPairData) {
  const signerController = {
    '@context': 'https://w3id.org/security/v3-unstable',
    id: keyPairData.controller,
    assertionMethod: [keyPairData.id],
    authentication: [keyPairData.id]
  };

  const keyPair = await Ed25519VerificationKey2020.from(keyPairData);
  const suite = new Ed25519Signature2020({key: keyPair});
  
  const signed = await jsigs.sign(didDocument, {
    documentLoader: loader,
    suite: suite,
    purpose: new AssertionProofPurpose({ controller: signerController }),
    compactProof: false
  });

  return signed
}
