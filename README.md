# ply-demo
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ply-ct/ply-demo/ply-demo%20ci)

Illustrates how to use Ply for automated API testing.

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