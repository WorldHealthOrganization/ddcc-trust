
function buildHeader(didController) {
  return {
    "@context": [
      "https://www.w3.org/ns/did/v1", 
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    id: didController,
    verificationMethod: []
  };
}

/**
 * didController: the did uri of the controller, e.g. did:web:raw.githubusercontent.com:WorldHealthOrganization:ddcc-trust:main
 * wrappedJwk {
 *   kid: ID as used in the QR Code Spec
 *   publicKeyJwk: JWK object as defined by https://www.w3.org/community/reports/credentials/CG-FINAL-lds-jws2020-20220721/
 * }
 */
export function assemble(didController, wrappedJwks) {
  let didDocument = buildHeader(didController)

  wrappedJwks.forEach((wrap) => {
    didDocument.verificationMethod.push({
      "id": didController+"#"+wrap.kid,
      "type": "JsonWebKey2020",
      "controller": didController,
      "publicKeyJwk": wrap.publicKeyJwk
    });
  });

  return didDocument
}

export function assembleCollectionEmbed(didController, didDocumentCollection) {
  let didDocument = buildHeader(didController)

  for (const didURI in didDocumentCollection) {
    for (const verifMethod of didDocumentCollection[didURI].verificationMethod) {
      didDocument.verificationMethod.push(verifMethod);
    }
  }

  return didDocument
}

export function assembleCollectionReference(didController, didDocumentCollection) {
  let didDocument = buildHeader(didController)

  for (const didURI in didDocumentCollection) {
    for (const verifMethod of didDocumentCollection[didURI].verificationMethod) {
      didDocument.verificationMethod.push(verifMethod.id);
    }
  }

  return didDocument
}
