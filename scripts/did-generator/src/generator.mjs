
import { assemble, assembleCollectionEmbed, assembleCollectionReference } from './did-doc-assembler.mjs'
import { sign } from './did-doc-signer.mjs'
import { verify } from './did-doc-verifier.mjs'
import { pemToJwk, mapBySKI } from './pem-to-jwk.mjs'

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

import chalk from 'chalk';

const colors = {
	info: "\t"+chalk.blue('ℹ'),
	ok: "\t"+chalk.green('✔'),
	warn: "\t"+chalk.yellow('⚠'),
	canceled: "\t"+chalk.red('✖')
};

function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

  // Assemble certificate store
function loadCertStore(allFiles) {
  let certs = [];
  allFiles.forEach((file) => {
    if (file.endsWith(".pem")) {
      certs.push(fs.readFileSync(file, "utf8"))
    }
  })
  return mapBySKI(certs)
}

function buildKid(file) {
  return file.substring(file.lastIndexOf("/")+1, file.lastIndexOf("."))
}

function wrapJwk(kid, jwk) {
  return [{
    kid: kid,
    publicKeyJwk: jwk
  }];
}

function unwrapSHCJwks(jwks) {
  let unwrapped = []
  for (const jwk of jwks.keys) {
    unwrapped.push(
      {
        kid: jwk.kid,
        publicKeyJwk: jwk
      }
    )
  }
  return unwrapped;
}

function writeDidJson(dest, jsonObj) {
  let currentJson = JSON.parse(fs.readFileSync(dest+"/did.json", "utf8"))
  let newJson = JSON.parse(JSON.stringify(jsonObj, null, 2))

  if (currentJson["proof"]) {
    delete currentJson["proof"]["created"]
    delete currentJson["proof"]["proofValue"]

    delete newJson["proof"]["created"]
    delete newJson["proof"]["proofValue"]
  }

  if (JSON.stringify(currentJson, null, 2) !== JSON.stringify(newJson, null, 2)) {
    fse.outputFile(dest+"/did.json", JSON.stringify(jsonObj, null, 2));
  }  
}

async function assembleWrite(didController, destFile, wrappedJwks) {
  const didDocument = assemble(didController, wrappedJwks)
  writeDidJson(destFile, didDocument);
  return didDocument
}

async function assembleSignWrite(didController, destFile, wrappedJwks, signerKeyPair) {
  const signedDIDDocument = await sign(assemble(didController, wrappedJwks), signerKeyPair)
  writeDidJson(destFile, signedDIDDocument);
  return signedDIDDocument
}

async function assembleCollectionWrite(didController, destFile, didCollection, assembleFunc) {
  const didDocument = assembleFunc(didController, didCollection)
  writeDidJson(destFile, didDocument);
  return didDocument
}

async function assembleCollectionSignWrite(didController, destFile, didCollection, signerKeyPair, assembleFunc) {
  const signedDIDDocument = await sign(assembleFunc(didController, didCollection), signerKeyPair)
  writeDidJson(destFile, signedDIDDocument);
  return signedDIDDocument
}

async function process(srcDir, dstDir, didRoot, signerKeyPair) {
  let allFiles = getAllFiles(srcDir)

  // Required to find trust chain
  let certDict = loadCertStore(allFiles)

  let signedDIDs = {}
  let unsignedDIDs = {} 
  
  // Converts all certs to JWKs in parallel
  for (const file of allFiles) {
    try {
      if (file.endsWith(".pem")) {
        console.log(colors.ok, file)
        const kid = buildKid(file)
        const pem = fs.readFileSync(file, "utf8")
        
        const wrappedJwks = wrapJwk(kid, pemToJwk(pem, certDict))
  
        const unsignedDidURI =  didRoot+":u:k:"+kid
        unsignedDIDs[unsignedDidURI] = await assembleWrite(unsignedDidURI, dstDir+"/u/k/"+kid, wrappedJwks)
  
        const signedDidURI =  didRoot+":s:k:"+kid
        signedDIDs[signedDidURI] = await assembleSignWrite(signedDidURI, dstDir+"/s/k/"+kid, wrappedJwks, signerKeyPair)
      }
  
      if (file.endsWith(".json")) {
        const kid = buildKid(file)
        const jsonObj = JSON.parse(fs.readFileSync(file, "utf8"))
        if ('keys' in jsonObj && jsonObj["keys"][0]) { // SHC File
          console.log(colors.ok, file)
          const wrappedJwks = unwrapSHCJwks(jsonObj)
  
          const unsignedDidURI =  didRoot+":u:k:"+kid
          unsignedDIDs[unsignedDidURI] = await assembleWrite(unsignedDidURI, dstDir+"/u/k/"+kid, wrappedJwks)
    
          const signedDidURI =  didRoot+":s:k:"+kid
          signedDIDs[signedDidURI] = await assembleSignWrite(signedDidURI, dstDir+"/s/k/"+kid, wrappedJwks, signerKeyPair)
        } else {
          console.log(colors.canceled, file)
        }
      }
    } catch (exceptionVar) {
      console.log(exceptionVar)
      console.log(colors.canceled, "Error Processing " + file)
    }
  }

  // Unsigned Master List by Reference
  assembleCollectionWrite(didRoot+":u:ml:r", dstDir+"/u/ml/r", unsignedDIDs, assembleCollectionReference)
  // Unsigned Master List with Embed Keys
  assembleCollectionWrite(didRoot+":u:ml:e", dstDir+"/u/ml/e", unsignedDIDs, assembleCollectionEmbed)

  // Signed Master List by Reference
  assembleCollectionSignWrite(didRoot+":s:ml:r", dstDir+"/s/ml/r", signedDIDs, signerKeyPair, assembleCollectionReference)
  // Signed Master List with Embed Keys
  assembleCollectionSignWrite(didRoot+":s:ml:e", dstDir+"/s/ml/e", signedDIDs, signerKeyPair, assembleCollectionEmbed)
  
  console.log("Finished")
}

// Signing keys (demo)
const keyPair = {
  "id": "did:web:PCF.PW:1A13#WEB",
  "controller": "did:web:PCF.PW:1A13",
  "type": "Ed25519VerificationKey2020",
  "publicKeyMultibase": "z6MksttRwLREud56E3ZHpUEDntm9aN9fdYvX6kY2a2gNjH5h",
  "privateKeyMultibase": "zrv4W86GX8Qq6ukrxEZwvB562MG7jcMqdSo1H37bMeYYAE1NQL2ygTPiuF4L4ZQdDLQfAkRYNVB6LJh2rzonPsnUS7h"
}

process("../../production-keys", "../../dist/prod", "did:web:raw.githubusercontent.com:WorldHealthOrganization:ddcc-trust:main:dist:prod", keyPair)
process("../../test-keys", "../../dist/test", "did:web:raw.githubusercontent.com:WorldHealthOrganization:ddcc-trust:main:dist:test", keyPair)

