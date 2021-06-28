## What is this?

A simple REST API using Express so I could learn the basics of TypeScript, here on GitHub so I can look at it as a refresher.

This stores a text file as a list of lines.

(Running this project as-is listens on localhost:8080)

The API lets you:
- Retrieve a line by its index
- Append a line to the end of the file
- Delete a line by its index
## Endpoints

**GET** `/` - You should give a parameter `line` (with your intended line number) with your request.

If it is a valid line number and such a line exists, API returns 200 OK and the contents of the line.

Otherwise, you get an error and an appropriate message for why.

---

**POST** `/append` - You should encode the parameter `text` (with your intended text) in your request.

All newline characters are removed from your input, and then it is appended to the list of lines.

---

**POST** `/delete` - You should encode the parameter `line` (with your intended line number) with your request.

If it is a valid line number and such a line exists, API returns 200 OK and deletes the line.

Otherwise, you get an error and an appropriate message for why.

## Things of note
- Defensive programming against non-integers, non-numbers, missing parameters, bound checks, NaN/null/undefined
- This defense is done via middleware and reused for both the delete and get requests (which I thought was neat)
- Logger middleware is applied globally to all requests and let me verify my code does what it should
- This code is **not necessarily correct** for simultaneous requests - It should use locks when interacting with the shared `lines` variable (but I'm still a noob)
- I used [Insomnia REST](https://insomnia.rest/) to test POST requests.
