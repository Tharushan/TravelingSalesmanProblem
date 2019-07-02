# Traveling Salesman Problem

Your assignment is to develop a simple API that computes an optimized itinerary solving the [Traveling Salesman Problem](https://developers.google.com/optimization/routing/tsp/tsp).
This API does not require to have any mean of authentication.

The API should offer the following endpoint : 

### POST /routeOptimizer

- This method should consume the list of tasks, with their durations and coordinates, and return a **schedule**, that takes into account both the travel time between those points and the duration of the task at each point.
- The method should return the most efficient route, that accounts for **driving time**
- The task schedule returned should also take the **home coordinates** into account. *Example : If the first task is 30minutes away, and the departureTime is set to 09:00am, the first task should be scheduled at 09:30*

**Input :**

```javascript
{
   // Time at which we're leaving home
   "departureTime": "1508756400",
   "home": {
      "lat": 48.83310530000001,
      "lng": 2.333563799999979
   },
   "tasks":[
      {
         "id":1,
         "lat":48.8623348,
         "lng":2.3447356000000354,
         "duration":45 // Duration of the task, in minutes
      },
      {
        "id":2,
        "lat":48.879251,
        "lng":2.282264899999973,
        "duration": 60
      },
      {
        "id": 3,
        "lat": 48.7251521,
        "lng": 2.259899799999971,
        "duration": 30
      },
      {
        "id": 4,
        "lat": 48.83477,
        "lng": 2.370769999999993,
        "duration": 90
      }
   ]
}
```

**Output :**
```javascript
{
  "totalTime": 425, // Total time from leaving home to returning home

  // Array of tasks
  "schedule": [
    {
      "id": 1, // id of the task
      "startsAt": 1508756400, // UNIX timestamp of the starting time
      "endsAt": 1508756400, // UNIX timestamp of the ending time
      "lat":48.8623348,
      "lng":2.3447356000000354,
    },
    // .. etc ..
  ]
}
```

## Bonus : 

- Instead of using the simple driving time between the tasks, take the estimated future traffic into account.

## Requirements

- Your repository should include a `README` file that describes the steps to run your project.
- The whole stack is up to you. Feel free to use any API or third-party library. 

Once you are done, please share a link to your repository

We will also take the following into consideration :

- Maintainability of the code
    - Code linting, test coverage..
    - Documentation
    - Clean code
- Creativity

# How to test ?

```
npm start
```

This will start server on port `8000` (as set in [config/production.json](config/production.json)) then you can create request like this :

```
curl -X POST \
  http://localhost:8000/routeOptimizer \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
   "home": {
      "lat": 48.83310530000001,
      "lng": 2.333563799999979
   },
   "tasks":[
      {
         "id":1,
         "lat":48.8623348,
         "lng":2.3447356000000354,
         "duration": 45
      },
      {
        "id":2,
        "lat":48.879251,
        "lng":2.282264899999973,
        "duration": 60
      },
      {
        "id": 3,
        "lat": 48.7251521,
        "lng": 2.259899799999971,
        "duration": 30
      },
      {
        "id": 4,
        "lat": 48.83477,
        "lng": 2.370769999999993,
        "duration": 90
      }
   ]
}'
```

`departureTime` property is optional, if not provided it will use current date

## Documentation

Swagger documentation is available after using `npm start` on `http://localhost:8000/docs`