## Neuraspace - QA Challenge

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)

This repository contains an automated QA test suite developed using playwright and typescript for Neuraspace's QA challenge.  
The purpose is to demonstrate proficiency in api testing, test automation design, and basic CI integration.

### Challenge Deliverables

Below are the deliverables for each exercise in the QA challenge:

| Exercise | File |
|----------|------|
| 1        | [`exercise-1.md`](./exercise-1.md) |
| 2        | [`src/tests/exercise-2.spec.ts`](./src/tests/exercise-2.spec.ts) |
| 3        | [`src/tests/exercise-2.spec.ts`](./src/tests/exercise-2.spec.ts) |

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 or higher recommended)
- npm (comes with Node.js)

### Installation

Clone the repository and install the dependencies:

```
npm ci
npx playwright install --with-deps
```

### Running Tests

To execute all tests:

```
npx playwright test
```
To run a specific test file:
```
npx playwright test exercise-2.spec.ts
```
