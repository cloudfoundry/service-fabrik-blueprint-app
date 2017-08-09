Service-Fabrik-Blueprint-App
=============

Background
----------

### What is Blueprint-App?

This application is used to perform simple HTTP requests to a bound blueprint-service.
The intention is to check whether the blueprint-service is consumable regularly and fulfills its specification.
Therefore, the HTTP responses will be evaluated and their correctness will be verified.

Requirements
-----

### Local Development Setup

You would need a functional Bosh Lite setup on your local system [Reference](https://github.com/SAP/service-fabrik-broker#installing-bosh-lite)
Working Cloud Foundry Installation on Bosh Lite [Reference](https://github.com/SAP/service-fabrik-broker#installing-cloud-foundry)

Usage
-----

Clone the repository for Service Fabrik Blueprint App

```
git clone https://github.com/sap/service-fabrik-blueprint-app
```
This would clone the repository in your current working directory
Then, run this code from the command line

```
cd blueprint-app/
npm install
cf push
```

Reachable under the resource ```/test```, all files stored within the ```test/``` directory will be loaded and executed.
If you may want to perform only a single test, use the resource ```/test/{TheResourceYouWantToTest}```, e.g. ```/test/files```.

To execute tests for the ```/admin``` resource of the blueprint-service as well, you will need to provide the admin credentials to the blueprint-app via its environment.

```
cf set-env blueprint-app ADMINUSER <USERNAME>
cf set-env blueprint-app ADMINPASS <PASSWORD>
```

The relating test file ```/test/admin.spec.js``` will only be executed if these environment variables are set.


## How to obtain support

If you need any support, have any question or have found a bug, please report it in the [GitHub bug tracking system](https://github.com/sap/service-fabrik-backup-restore/issues). We shall get back to you.

## LICENSE

This project is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE](LICENSE) file
