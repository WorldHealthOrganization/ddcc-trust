# DDCC Global Trust Registry

This repository contains keys and sample QR codes from participating members. 

# DIDs Available

The directory `dist` includes resolvable DID Documents for the keys provided. The folder structure separates by production (`prod`) and testing (`test`) documents, and within each into signed (`s`) and unsigned (`u`) directories of which master lists (`ml`) and keys (`k`) can be found. Master lists are further split between those with embed (`e`) and referenced (`r`) keys. 

Ideally, the final directory represents the `kid` found in the QR code. 

To re-generate the keys, delete the dist folder and run 

```
cd scripts/did-generator
npm install
npm run-script generate
```

# Join the Discussion

* Join our chat on Zulip [WHO SMART Guidelines/Trust Registry](https://chat.fhir.org/#narrow/stream/328106-who-smart-guidelines.2Ftrust-registry)
* For WHO SMART Guidelines topics, see the FHIR Zulip chat for [WHO SMART Guidelines](https://chat.fhir.org/#narrow/stream/310477-who-smart-guidelines)

# Contributing

[Issues](https://github.com/WorldHealthOrganization/ddcc-trust/issues) and [pull requests](https://github.com/WorldHealthOrganization/ddcc-trust/pulls) are very welcome. Participating members are encoraged to send and update your keys and sample QR codes via Pull Requests. 
