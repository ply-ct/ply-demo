# ply-demo
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ply-ct/ply-demo/ply-demo%20ci)

Illustrates how to use Ply for automated API testing. Includes an example GitHub workflow to demonstrate
Ply continuous testing.

## Run all tests
```
git clone https://github.com/ply-ct/ply-demo.git
cd ply-demo
npm install
npm test
```
In package.json scripts, "pretest" starts [ply-movies](https://github.com/ply-ct/ply-movies),
which serves up the REST API exercised by many of our Ply [requests](test/requests) and [cases](test/cases).
Check out the [docs](https://ply-ct.github.io/ply/topics/requests) for further explanation.

## Run a single request suite
```
cd ply-demo
npm run start-movies
ply test/requests/movie-queries.ply.yaml
npm run stop-movies
```

The output indicates that all movie-queries requests have passed:
```
Request 'moviesByYearAndRating' submitted at 8/17/2020, 11:43:48:465
Test 'moviesByYearAndRating' PASSED in 50 ms
Request 'movieById' submitted at 8/17/2020, 11:43:48:516
Test 'movieById' PASSED in 7 ms
Request 'moviesQuery' submitted at 8/17/2020, 11:43:48:523
Test 'moviesQuery' PASSED in 6 ms

Overall Results: {"Passed":3,"Failed":0,"Errored":0,"Pending":0,"Not Verified":0}
Overall Time: 225 ms
```

## Visual Studio Code
Install Ply's [VS Code extension](https://github.com/ply-ct/vscode-ply#vscode-ply) to run tests in 
the Test Explorer sidebar.

## GitHub Workflow
This simple CI [workflow](https://github.com/ply-ct/ply-demo/blob/master/.github/workflows/build-test.yml)
shows how to use npm scripts to automatically execute all requests and cases whenever a commit is pushed
on the master branch.

This readme file includes a GitHub Workflow status badge hosted by shields.io: https://github.com/badges/shields#quickstart.

