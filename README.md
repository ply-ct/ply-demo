# ply-demo -- Branch for testing
<a href="https://github.com/ply-ct/ply-demo/actions">
    <img src="https://github.com/ply-ct/ply-demo/workflows/build/badge.svg" />
</a>
<a href="https://github.com/ply-ct/ply-demo/actions">
  <img src="https://ply-ct.org/badges/ply-ct/ply-demo/workflows/build" />
</a>

Illustrates how to use [Ply](https://ply-ct.github.io/ply/) for automated API testing. 
Includes an example GitHub Actions workflow to demonstrate Ply continuous testing.

## Run a request suite
```
git clone https://github.com/ply-ct/ply-demo.git
cd ply-demo
npm install
npx ply test/requests/movie-queries.ply.yaml
```

The output indicates that all movie-queries requests have passed:
```
Ply version: "3.0.40"
Request 'moviesByYearAndRating' submitted at 4/11/2022, 14:01:18:716
Request 'moviesByYearAndRating' PASSED in 32 ms
Request 'movieById' submitted at 4/11/2022, 14:01:18:745
Request 'movieById' PASSED in 8 ms
Request 'greatFilmsOf1935' submitted at 4/11/2022, 14:01:18:754
Request 'greatFilmsOf1935' PASSED in 7 ms
Request 'bestMovieOf1935' submitted at 4/11/2022, 14:01:18:762
Request 'bestMovieOf1935' PASSED in 6 ms
Request 'stinkersOf1932' submitted at 4/11/2022, 14:01:18:769
Request 'stinkersOf1932' PASSED in 7 ms

Overall Results: {"Passed":5,"Failed":0,"Errored":0,"Pending":0,"Submitted":0}
Overall Time: 126 ms
```

## Run all tests
```
cd ply-demo
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
This simple CI [workflow](https://github.com/ply-ct/ply-demo/blob/main/.github/workflows/build-test.yml)
shows how to use npm scripts to automatically execute all requests and cases whenever a commit is pushed
on the main branch.

## Ply GitHub Action
This readme file includes the [Ply Action](https://github.com/ply-ct/ply-action#readme) status badge.

