# Coblosin (Decentralized Voting Management System)

This repository is a submission for the [TypeScript Smart Contract 101](https://dacade.org/communities/icp/challenges/256f0a1c-5f4f-495f-a1b3-90559ab3c51f) challenge by the Internet Computer community on [Dacade](https://dacade.org/).

## Overview
This documentation provides an overview of the Decentralized Voting Management System, implemented in TypeScript using the Azle framework. The system allows users to vote for existing candidates, and also enables administrators to manage candidates by adding new ones, updating existing candidates, deleting candidates, and querying candidates.

## Getting started

Follow the steps below to set up and run the project locally.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/) (v0.15.1 or later)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/stevenaruu/Coblosin.git
```

2. Navigate to the project directory:
```bash
cd coblosin
```

3. Install dependencies
```bash
npm install
```

4. Start the IC local development environment
```bash
dfx start --background --clean
```

5. Deploy the canisters to the local development environment
```bash
dfx deploy
```

## Functionalities
The canister is designed with a multi-role system to facilitate various operations. Below are the roles defined within the system and the functionalities assigned to each.
- **registerUser**: Used for account registration.
- **loginUser**: Used to log into the account.
- **getAllCandidate**: Allow users to see all candidates.
- **voteCandidate**: Allow users to vote candidates.
- **becomeAdmin**: Allow users to become administrators.
- **insertCandidate**: Allow administrators to insert candidates.
- **updateCandidate**: Allow administrators to update candidates.
- **deleteCandidate**: Allow administrators to delete candidates.
