Blueprint-App
=============

Background
----------

### What is Blueprint-App?

This application is used to perform simple HTTP requests to a bound blueprint-service.
The intention is to check whether the blueprint-service is consumable regularly and fulfills its specification.
Therefore, the HTTP responses will be evaluated and their correctness will be verified.

Usage
-----

Clone the repository.

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

## LICENSE

This project is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE](LICENSE) file
