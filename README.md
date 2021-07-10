# ply-demo
<a href="https://github.com/ply-ct/ply-demo/actions">
    <img src="https://github.com/ply-ct/ply-demo/workflows/build/badge.svg" />
</a>
<a href="https://github.com/ply-ct/ply-demo/actions">
  <img src="https://ply-ct.com/badges/ply-ct/ply-demo/workflows/build" />
</a>

Illustrates how to use [Ply](https://ply-ct.github.io/ply/) for automated API testing. 
Includes an example GitHub workflow to demonstrate Ply continuous testing.

## Run a request suite
```
cd ply-demo
npx ply test/requests/movie-queries.ply.yaml
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

## Run all tests
```
git clone https://github.com/ply-ct/ply-demo.git
cd ply-demo
npm install
npm test
```
In package.json scripts, "pretest" starts [ply-movies](https://github.com/ply-ct/ply-movies#readme),
which serves up the REST API exercised by many of our Ply [requests](test/requests) and [cases](test/cases).

**Note**: Run [ply-movies locally](https://ply-ct.github.io/ply/topics/cases#ply-movies) in order for 
destructive tests to succeed.

## Visual Studio Code
Install Ply's [VS Code extension](https://github.com/ply-ct/vscode-ply#vscode-ply) to run tests in 
the Test Explorer sidebar.

## GitHub Workflow
This simple CI [workflow](https://github.com/ply-ct/ply-demo/blob/master/.github/workflows/build-test.yml)
shows how to use npm scripts to automatically execute all requests and cases whenever a commit is pushed
on the master branch.

This readme file includes the [Ply Action](https://github.com/ply-ct/ply-action#readme) status badge.

