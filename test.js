import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1s', target: 10 },
        // { duration: '1m', target: 20 },
        // { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<5000'], // 99% of requests must complete within 5s
    },
};

export default function () {
    // Define an array of requests with different request bodies
    const requests = ALL_REQUEST_FOR_ONE_TICKET

    // Pick a random request from the array
    const request = requests[Math.floor(Math.random() * requests.length)];

    // Send the request
    const res = http.post(request.url, JSON.stringify(request.body), {
        headers: { 'Content-Type': 'application/json' },
    });

    // Check if the response is successful
    check(res, { 'success': (r) => r.status === 200 });
    console.log(`Response time: ${res.timings.duration} ms`);

    // Wait for a random amount of time before sending the next request
    sleep(Math.random() * 0);
}


const ALL_REQUEST_FOR_ONE_TICKET = [
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f821d295e8562dbcd4b84",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8307295e8562dbcd4b86",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8310295e8562dbcd4b88",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8318295e8562dbcd4b8a",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f831e295e8562dbcd4b8c",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8324295e8562dbcd4b8e",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8335295e8562dbcd4b90",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8350295e8562dbcd4b92",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8359295e8562dbcd4b94",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
    {
        url: 'http://localhost:8085/api/v1/web/users/movies/ticket', body: {
            "user_id": "642f8373295e8562dbcd4b96",
            "movie_id": "642fa0c9c4715b6bbcc29ced",
            "showtime_id": "642fa0c9c4715b6bbcc29cee",
            "ticket_id": "A1"
        }
    },
];
