## Global Trust Network: Part 1: Trust List Specification

**Visibility**: Public<br />
**Status**: Draft<br />
**Authors**: [Vitor Pamplona](mailto:vitor.pamplona@pathcheck.org)<br />
**Contributors**: [John Walker](mailto:john.walker1@undp.org), [Carl Leitner](mailto:leitnerc@who.int), [Lucy Yang](mailto:yang.qixue@undp.org)<br />
**Last major revision**: 2022-08-03

# Introduction

As part of the WHO DDCC effort, we are striving to architect a Global Trust Network that can bring existing and new local and regional trust networks together in a way that respects their designs and sovereignty while contributing to real interoperability among all of them.

Note: This is a working document drafted by the WHO service team to kick off technical discussions on the Trust List Specification for a Global Trust Network. Everything discussed in this document is work in progress and none of the things is set in stone.

# Objective

A key to real interoperability among existing trust networks is to find alignment on trust list formats. The goal of this document is to find and/or define a common Trust List format to assemble and share public key infrastructure for all COVID credential specifications used by existing trust networks.

## Specific Goals and Activities

1. Align the strategic technical design for the Global Trust Network, which will drive the definition of the Trust List format
2. Define the lowest common denominator format that can interoperate all specifications
   1. Define the minimum security requirements
3. Define the structure of added features to support the most stringent use cases
   1. Determine the level or levels of security trust list operators are providing
4. Integrate the Global COVID Certificate Network (GCCN [#1](#sdfootnote1anc)) as the technical solution for the Global Trust Network and determine integrations with the GCCN metadata APIs

# Background

Before diving into the requirements and thought processes for an ideal Trust List solution, we summarized the relevant aspects of the four existing major trust networks for context. The descriptions, brief and not comprehensive, were developed by the WHO service team and didn't represent views from each Network operator. We welcome any clarifications from the operators as direct comments in the document

1. EU DCC: This network allows its members to upload roots of trusts including intermediate and signing certificates. The Trust List uses a CMS Signed Data structure signed by the organization. It operates by creating a directory of Roots of Trust x509 certificates, one per participant. Signing certificates are created by participating members, signed by their root of trust, and submitted to the DCC Gateway. The Gateway then exposes all signing certificates with their anchors of trust. The governance model [#2](#sdfootnote2anc) of the Gateway provides a strong assurance of the quality of certificates.
2. ICAO-defined trust network [#3](#sdfootnote3anc): Within the network, "master lists" and "trust lists" can be issued that allow participating entities to share lists of their trusted public key certificates. Credentials that follow the ICAO Visible Digital Seal for non-Constrained Environments (VDS-NC) format typically include the signing certificate directly in the credential itself. Verification is based on the chain of trust of certificates disseminated in Master Lists. ICAO has also issued a Health Master List with roots of trust and intermediary certificates - a CMS signed data structure signed by the organization. Given its openness to certificates of different trust networks, no specific health policies or issuing standards are currently enforced.
3. VCI Directory: This network provides a list of entities with associated metadata that simply comply with the technical specification of the Smart Health Cards. No policy assertions are made about the issuers beyond the metadata information. The most common use of the network is an unsigned directory of members and resolvable key IDs on a custom-designed JSON file. The root of trust is the domain url of the issuer.
4. DIVOC Consortium: This network does not provide a master list of members. It expects verifiers to bilaterally work with each issuer to determine the roots of trust and format specifications. Generally, members expose their public keys directly to a domain. Issuer metadata, key usage, and policies are undefined.

The 4 trust networks existing today have vastly different trust requirements and use different formats to describe the asserted trust.

# Requirements

A unifying Trust List format must:

1. be convertible from each existing trust network's formats.
2. describe a key-to-trust-anchor path for all specifications.
3. be cacheable
4. be mergeable (trust list operators can integrate each other's entries)
5. be integratable with GCCN's metadata format
6. be usable by all stakeholders required to verify health credentials in their operations

## Technical Requirements

A unifying Trust List format must:

1. accept x509 certificates and single public keys for all available types
2. use existing key IDs to find all the verification content.
3. be differential (clients can download only changes from last time)

# Review of Content Options

Trust List formats vary in the level of security and content. A list can be cryptographically signed or unsigned. They can include from just references for keys, such as a collection of key IDs, all the way down to a complete description of the issuing policies and information for the user interface of applications.

## To sign or not to sign?

A signed list avoids a man-in-the-middle attack. It allows consumer apps to cryptographically verify the origin of the list without relying on any intermediaries or intermediary infrastructure. It also allows the republication of the original list at will without damaging its security level, which is great for caching systems. Privacy is increased since there is no need to reach the issuer or the trust list provider to download a copy of the list. The signature, however, adds complexity from key management and key distribution as well as performance impacts in low-end environments.

An unsigned list is simpler to make, but consuming applications are required to trust the web stack of the issuer (DNS + IP), off-line procedures and any caching mechanism.

## What to include?

A trust list can include one or more of the following content:

1. Issuer IDs or key IDs (e.g. list of approved URLs or DIDs)
2. Public key information
3. Certificate chain (e.g. effective periods and country signing certification authorities)
4. Approved key usage information (e.g. EU's DCC OIDs inside certificates)
5. Revocation Information / Lists
6. Machine-actionable services (e.g. renewal link, more information, status checks, etc)
7. Human-actionable services (e.g. renewal link, more information, status checks, etc)
8. Information on the issuer's or the jurisdiction policies and compliance
9. Information for the user interface of the application

Trust lists with smaller content scopes are not only faster to download and parse but also require less whole-list updates for simple changes in each category. Smaller scopes, however, defer the security and privacy of the added information to another standard. A trust list of simple issuer IDs, for instance, allows issuers to update their keys without changing the trust list itself. However, it also requires consuming apps to contact the issuer's servers directly to download the keys or additional information about them. A trust list with complete information will most likely have to duplicate records within itself (e.g. certificate chains can be the same for multiple keys), making it a sub-optimal format. Embedding information in a trust list also increases the controlling power of the Trust List Provider, away from the Issuer.

# Existing Trust List Implementations

PEM files support multiple keys and certificates in sequence. However, the sequence is intended to be for certificate chains only and not for multiple distinct certificates.

ICAO uses a CMS Signed Data (RFC 5652)​​ with an ASN.1 x509 Certificate Key Set using OID 2.23.136.1.1.2 ([ICAO Trust List](https://www.icao.int/publications/Documents/9303_p12_cons_en.pdf), page 60 [#4](#sdfootnote4anc)). The format is used within the ICAO trust network within which certificates follow certain 'profiles'. Data needed for key identification during verification is always encoded within the certificates themselves. This file includes the signing certificates and any information inside of them. The format does not allow for any such accompanying information to be included outside the certificates.

Germany uses a custom [JSON-like structure](https://de.dscg.ubirch.com/trustList/DSC) where the first line of the file is a signature and the second line is the JSON content for that signature. The content contains the certificate in DER/PEM format, a signature for each entry, a certificate type, country and key ID. The signature is used to identify if the file has been changed before parsing the full contents of the JSON.

The EU Gateway offers a [signed Zip file](https://ec.europa.eu/assets/eu-dcc/dcc_trustlist.zip) of the PEM certificate files, placed into directories representing each country and split between CSCAs and DSC. A separate file contains the [signature](https://ec.europa.eu/assets/eu-dcc/dcc_trustlist.zip.sig.txt) for the ZIP. There is no key ID information in the zip file.

VCI offers an unsigned issuer [list with only the IDs](https://github.com/the-commons-project/vci-directory/blob/main/vci-issuers.json) of approved members as well as a [signed nightly snapshot](https://github.com/the-commons-project/vci-directory/blob/main/logs/vci_snapshot.json) of all keys as JWKs from each of those issuers. Both alternatives use a custom JSON structure and include the issuer name, website and key ID.

LacPass uses a [DID Document](#fm8eag7loy23) for X509-enabled trust lists of leaf keys. This format contains the information about the key itself, key usage restrictions and key ID. The DID Document does allow embedded or referenced DID lists. Registries can either embed or simply reference the original DID of the issuer. And both styles can happen inside the same DID Document. A signed version of the same structure is also possible using LD Proofs.

[PathCheck](https://github.com/Path-Check/trust-registry/blob/main/registry_normalized.json) offers a set of unsigned custom JSON and CSV structures that follow the [TrustOverIP](https://wiki.trustoverip.org/display/HOME/ToIP+Trust+Registry+Protocol+Specification) Trust Registry Protocol. Complete registries are updated daily and can be downloaded as a whole, in 6 formats, or on-demand from the dynamic server. All formats include a unified version of the name of the issuer, website, logo, effective period of usage, key restriction information and public key or certificate information, separated by specification. Keys are presented in both DER/PEM structures and JWKs, with the latter including the certificate chain. A signed DID Document is also offered. Because of the large JSONs, mobile applications tend to prefer processing the CSV files to improve parsing performance.

# Leading Contender: DID Document

The initial research and analysis we have done points us to the [DID Document](https://www.w3.org/TR/did-core/) format (Appendix A) as a lead contender for the Global Trust Network. The same format accepts embed and reference keys as well as signed, double signed and unsigned payloads. It can be stored in the web or other stacks, such as Blockchains and decentralized file systems like IPFS. DID Documents will include keys as JWKs and x509 certificates can be added into those records.

Within the proposed approach, the [DID Controller](https://www.w3.org/TR/did-core/#dfn-did-controllers) is the entity that is authorized to make changes to a DID document. The [DID Subject](https://www.w3.org/TR/did-core/#dfn-did-subjects) is a Trust List. The [Verification Relationship](https://www.w3.org/TR/did-core/#verification-relationships) is an assertion because the DID Controller is asserting which participants are trusted. The controller for each key should be another DID Document created by the issuer (or a representative of the issuer).

One key restriction of the DID Document is the required change in the KeyID chosen by each specification. The new KeyID must be resolvable by a DID Resolver and thus requires a prefix based on the DID method being used. Public keys that use the same certificate chain will duplicate the chain record inside the document, making it sub-optimal.

The integration with GCCN is natural. TPS records of the GCCN network will point to the modified keyID, the DID:WEB id, and might be signed by the same signer as the DID Document. The Controlling DIDs/DID Documents of each key should reference a service endpoint directly to the individual issuer in the GCCN/TRAIN repository.

BBS+ signature in the DID Document allows an app to "sum" a previously downloaded DID Document with a new DID Document that only includes the changes since last time. Consumer applications can rebuild and share a complete trust registry with a verifiable signature of the original party by just downloading verifiable parts of it. This vastly improves the dissemination of a large registry through unsecured environments, when needed.

Even though DID Documents are generally stored in a blockchain, or decentralized service like IPFS, issuers can use a DID:WEB method to store the list on their servers.

In summary, a DID Document supports:

1. Issuer IDs or key IDs (e.g. list of approved URLs or DIDs)
2. Public key information
3. Certificate chain (e.g. effective periods and country signing certification authorities)
4. Approved key usage information (e.g. EU's DCC OIDs inside certificates)

The following information must be provided by the GCCN format:

1. Revocation Information / Lists
2. Machine-actionable services (e.g. renewal link, more information, status checks, etc)
3. Human-actionable services (e.g. renewal link, more information, status checks, etc)
4. Information on the issuer's or the jurisdiction policies and compliance
5. Information for the user interface of the application

In this format, the following steps are required for verification:

1. Verify the DID Document was signed by a trusted provider (offline signing key)
2. Verify if the desired key is included in the assertionMethod
3. Verify the x509 chain of the key, if existent
4. Verify if the root of the chain is trusted
5. Verify if chain effective dates (not before and expiration dates) are all valid
6. Verify if the key usage OIDs inside the certificate match the credential type.
7. Verify if the DID id record in the GCCN list is valid
8. Verify if the issuing services provided comply with local jurisdictions

The format is defined by the [W3C Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/) with great extensibility potential. Canonicalization and signature formats are defined by the [W3C Data Integrity 1.0](https://w3c-ccg.github.io/data-integrity-spec/) Each trust network can map their current formats into DID Documents and sign their own registries before merging into the Global Trust Network.

# Solved Challenges

We are currently navigating implementation details of the DID Document signature and the semantics of the claims made by and on behalf of the trust registry:

1. Recent DID spec changes removed the "proof" segment from the DID Document spec and delegated the definition of how to verify the authenticity of the DID Document to the DID Method in use. The DID Web specification is [still unclear](https://github.com/w3c-ccg/did-method-web/issues/20) on where to add the LD-Signatures proof section. The [current consensus](https://github.com/w3c-ccg/did-method-web/issues/20) is to add the "proof" section in the root of the didDocument.
   1. **Current solution**: DID:Web will point to a DID Resolution Document that includes the DID Document with the proof section

2. There is no clear [verification relationship](https://www.w3.org/TR/did-core/#verification-relationships) for entities participating in the DID Subject without being controlled by the main DID Controller and making claims on behalf of the DID Subject. Clarification of the verification relationship should be provided by a governance framework. In the example in Appendix A, we are using assertionMethod, which was originally designed to identify claims in a Verifiable Credential. We can create a new verification relationship and publish it [here](https://www.w3.org/TR/did-spec-registries/#verification-relationships) or clarify existing ones for implementers.
    1. **Current solution**: Do not make assertions.

# Appendix A: Signed DID Document for X509-enabled Trust Lists of leaf keys

Apps ping `did:web:example.com:covid:registry`, which resolves to `https://example.com/covid/registry/did.json` that contains:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:web:example.com:covid:registry",
  "verificationMethod": [
    {
      "id": "did:web:example.com:covid:registry#z82Lm3fE94..gAWBoXf",
      "type": "JsonWebKey2020",
      "controller": "did:web:z82Lm3fE94owner.com:controller",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-384",
        "x": "0z6urb4...0ihmYEGcdV0NOGp3DX",
        "y": "JyRn7Vr...KVqWHKmnrMqJkibsqT",
        "x5c": [ 
          "MIIBTzCB1gICEAEwC...QvKRIAYgCJpzK", // Key's x509
          "MIIBoTCCASeRPTQRC...Qbl2jQPUqeA==", // Intermediate CA
          "MIIBkjCCARigAwIBC...ACHL1KEKamA=="] // Root CA
      }
    }, {
      "id": "did:web:example.com:covid:registry#z82LkysSYZy8V7Nb...e2e1u65M4",
      "type": "JsonWebKey2020",
      "controller": "did:web:z82LkysSYZy8V7Nbowner.com:controller",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-384",
        "x": "a_EU0uUZKMBg...T1gbtu6mCwArHj",
        "y": "Ly2QJsaHdWrO...yE_DteZMnwP2ID",
        "x5c": [ 
          "MIIBTjCB1gICEAIwC...g3ibVJeoffiI=", // Key's x509
          "MIIBoTCCASeRPTQRC...Qbl2jQPUqeA==", // Intermediate CA
          "MIIBkjCCARigAwIBC...ACHL1KEKamA=="] // Root CA
      }
    }
  ],
  "proof": {  // LDProof Block
    "type": "Ed25519Signature2020",
    "created": "2022-07-27T16:02:20Z",
    "verificationMethod": "did:web:example.com:covid:registry-signer#key-1",
    "proofPurpose": "assertionMethod"
    "proofValue": "QNB13Y7Q9...1tzjn4w=="
  }
}
```

# Appendix B: Integrating GCCN with Trust Lists

GCCN provides an internet-accessible top level listing of participating, vetted, country level entities that leverage the registry to publish relevant meta-data and publicly verifiable service endpoints for Covid Certificate issuers within the control of each respective authority. Each entry in the top level registry points to a list of trusted service providers, represented in a 'trust scheme' defined by the sovereign country, or its agent, as the publishing owner of the 'trust scheme'.

To enable this, GCCN is leveraging a backend infrastructure project named TRAIN. TRAIN stands for "TRust mAnagement INfrastructure". TRAIN was developed by Fraunhofer-Gesellschaft in the EU NGI eSSIF-Lab project. The basic approach of TRAIN is to provide a lightweight trust infrastructure that makes use of the global, well-established, and trusted infrastructure of the Internet Domain Name System DNS as its root of trust.

While DNS is already used by practically everyone, linked DNS servers are susceptible to cache poisoning and MITM attacks. To address this, utilizing DNSSEC has been specified to ensure that the results returned are authentic. TRAIN uses DNSSEC whenever this is available.

GCCN Trust Schemes are XML documents patterned on the ETSI 119 612 TS, trust list standard; a standard recognized as eIDAS compliant. The representation of digital identities and roots of trust for services listed in a GCCN Trust Scheme are technology agnostic. The trust service pattern is extensible and supports many important service properties for GCCN to leverage, e.g. Service Provider (TSP) extension properties and support for "List of Lists'

Below, an example snippet of a GCCN Trust List - Trust Service Provider (TSP) definition, the key properties (reference URI's) for a TSP can include those as called out in DID Document Information Requirements section above. The properties include the legally recognized name properties, the trust scheme name, and the service information properties. The service information properties include a 'Service Digital Identity', which can reference either X.509 public keys or a DID, as suggested above.

Country Level Trust Service Provider

```xml
<TrustServiceProvider>
	<TSPInformation>
		<TSPName>
			<Name xml:lang="en">Example Provider</Name>
		</TSPName>
		<TSPRole xml:lang="en"> Issuer </TSPRole>
		<TSPLegalName>
			<Name xml:lang="en">Example Ministry of Public Health</Name>
		</TSPLegalName>
		<TrustSchemeName>
			<Name>example-nation.gccn.train.trust-scheme.en</Name>
		</TrustSchemeName>
		<TSPTradeName>
			<Name xml:lang="en">Example Ministry of Public Health</Name>
		</TSPTradeName>
           …
		<TSPService>
			<ServiceInformation> 
				<ServiceTypeIdentifier>https://trust-scheme/schema/gccn-schema.json</ServiceTypeIdentifier>
				<ServiceName>
					<Name xml:lang="en">The MOH Corona Check Application Coordination</Name>
				</ServiceName>
				<ServiceDigitalIdentity>
					<DigitalId>
						<DID>did:web:registry:..</DID>
					</DigitalId>
				</ServiceDigitalIdentity>
```

Reference Links for TRAIN and ETSI

[https://essif-lab.eu/essif-train-by-fraunhofer-gesellschaft/](https://essif-lab.eu/essif-train-by-fraunhofer-gesellschaft/)

[Logical Model for the ETSI 119 612 TS](https://www.etsi.org/deliver/etsi_ts/119600_119699/119612/02.02.01_60/ts_119612v020201p.pdf) ![](RackMultipart20220914-1-37rqbi_html_2cd55dc61c698817.png)

[1](#sdfootnote1anc) GCCN was started as a project at Linux Foundation Public Health. Lucy Yang and John Walker, the main initiators and contributors, are currently working with the UNDP to implement the open infrastructure in collaboration with/support of the WHO. An introduction to the decentralized federation model of GCCN, which was presented at the WHO G20 pilot technical meeting on June 10, is [here](https://drive.google.com/file/d/1wwzb-t8GZr6zkSJlpUsos0LtvbYMo6gT/view?usp=sharing).

[2](#sdfootnote2anc) The Gateway onboarding process ensures the integrity of the system by allowing membership only to governments, and by specifying requirements in terms of security, privacy and interoperability. Participating countries are responsible for managing their internal systems and ensuring the quality of the certificates they issue. As a result, the system safeguards its integrity as a whole.

[3](#sdfootnote3anc) ICAO has defined a trust network for international electronic travel documents that comprises independent roots of trust for issuing authorities and use of associated public key infrastructure according to agreed rules and procedures. The same trust network has been extended to the issuance and verification of health credentials used in travel.

[4](#sdfootnote4anc) The reference here is for a "Master List". ICAO has a trust list specification in the VDS-NC specifications: ICAO-TR Digital Travel Credentials, page 17, that is very similar but not identical. It is specific for the health case.