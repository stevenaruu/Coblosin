import { Canister, ic, init, Principal, query, Result, StableBTreeMap, text, update, Vec } from 'azle';
import { ErrorResponse, UserPayload, User, Candidate, CandidatePayload } from './types';
import { Candidates } from './candidates';
import { v4 as uuidv4 } from 'uuid';

const candidateStore = StableBTreeMap<text, Candidate>(0);
const usersStore = StableBTreeMap<Principal, User>(1);

export default Canister({
    init: init([], () => {
        Candidates.forEach(candidate => {
            candidateStore.insert(candidate.id, candidate);
        });
    }),

    registerUser: update([UserPayload], Result(User, ErrorResponse), (userPayload) => {
        try {
            if (usersStore.containsKey(ic.caller())) {
                return Result.Err({
                    code: 400,
                    message: "User already registered, please login",
                });
            }

            const newUser: User = {
                id: ic.caller(),
                role: 'USER',
                isRegistered: true,
                isChoose: false,
                createdAt: ic.time(),
                updatedAt: ic.time(),

                // payload
                name: userPayload.name,
                email: userPayload.email,
                address: userPayload.address,
                birth: userPayload.birth,
                phone: userPayload.phone,
            };

            usersStore.insert(newUser.id, newUser);
            return Result.Ok(newUser);
        } catch (err) {
            return Result.Err({
                code: 500,
                message: "Internal server error with message " + err
            })
        }
    }),

    loginUser: update([], Result(User, ErrorResponse), () => {
        try {
            if (!usersStore.containsKey(ic.caller())) {
                return Result.Err({
                    code: 404,
                    message: "User not exits, please register the account first",
                });
            }
            const user: User = usersStore.values().filter((user) => user.id.toString() === ic.caller().toString())[0];
            return Result.Ok(user);
        } catch (err) {
            return Result.Err({
                code: 500,
                message: "Internal server error with message " + err
            })
        }
    }),

    becomeAdmin: update([], Result(User, ErrorResponse), () => {
        try {
            const user: User = usersStore.values().filter((user) => user.id.toString() === ic.caller().toString())[0];
            if (!user) {
                return Result.Err({
                    code: 404,
                    message: "User not exits, please register or login the account first",
                })
            }
            const updatetedUser: User = {
                ...user,
                updatedAt: ic.time(),
                role: 'ADMIN'
            };
            usersStore.insert(user.id, updatetedUser);
            return Result.Ok(updatetedUser);
        } catch (err) {
            return Result.Err({
                code: 500,
                message: "Internal server error with message " + err
            });
        }
    }),

    insertCandidate: update([CandidatePayload], Result(Candidate, ErrorResponse), (candidate) => {
        try {
            const user: User = usersStore.values().filter((user) => user.id.toString() === ic.caller().toString() && user.role === 'ADMIN')[0];
            if (!user) {
                return Result.Err({
                    code: 400,
                    message: "You're not allowed to insert candidate"
                })
            }

            const newCandidate: Candidate = {
                id: uuidv4(),
                vote: 0n,

                name: candidate.name,
                image: candidate.image
            }

            candidateStore.insert(newCandidate.id, newCandidate);
            return Result.Ok(newCandidate);
        } catch (err) {
            return Result.Err({
                code: 500,
                message: "Internal server error with message " + err
            });
        }
    }),

    updateCandidate: update([text, CandidatePayload], Result(Candidate, ErrorResponse), (candidateId, candidatePayload) => {
        const user: User = usersStore.values().filter((user) => user.id.toString() === ic.caller().toString() && user.role === 'ADMIN')[0];
        if (!user) {
            return Result.Err({
                code: 400,
                message: "You're not allowed to update candidate"
            })
        }

        const candidate: Candidate = candidateStore.values().filter((candidate) => candidate.id === candidateId)[0];
        if (!candidate) {
            return Result.Err({
                code: 400,
                message: "Please choose the exists candidate",
            })
        }

        const updateCandidate: Candidate = {
            ...candidate,
            name: candidatePayload.name ? candidatePayload.name : candidate.name,
            image: candidatePayload.image ? candidatePayload.image : candidate.image
        }
        candidateStore.insert(candidate.id, updateCandidate);

        return Result.Ok(updateCandidate)
    }),

    deleteCandidate: update([text], Result(text, ErrorResponse), (candidateId) => {
        const user: User = usersStore.values().filter((user) => user.id.toString() === ic.caller().toString() && user.role === 'ADMIN')[0];
        if (!user) {
            return Result.Err({
                code: 400,
                message: "You're not allowed to delete candidate"
            })
        }

        const candidate: Candidate = candidateStore.values().filter((candidate) => candidate.id === candidateId)[0];
        if (!candidate) {
            return Result.Err({
                code: 400,
                message: "Please choose the exists candidate",
            })
        }

        candidateStore.remove(candidate.id);
        return Result.Ok(candidate.name + " as candidate is deleted")
    }),

    voteCandidate: update([text], Result(Candidate, ErrorResponse), (candidateId) => {
        try {
            const user: User = usersStore.values().filter((user) => user.id.toString() === ic.caller().toString())[0];

            if (user) {
                if (!user.isChoose) {
                    const candidate: Candidate = candidateStore.values().filter((candidate) => candidate.id === candidateId)[0];
                    if (!candidate) {
                        return Result.Err({
                            code: 400,
                            message: "Please choose the exists candidate",
                        })
                    } else {
                        const updatetedUser: User = {
                            ...user,
                            isChoose: true,
                            updatedAt: ic.time()
                        };
                        usersStore.insert(updatetedUser.id, updatetedUser)

                        const updateVote: Candidate = {
                            ...candidate,
                            vote: candidate.vote + 1n,
                        };

                        candidateStore.insert(candidateId, updateVote);
                        return Result.Ok(updateVote);
                    }

                } else {
                    return Result.Err({
                        code: 400,
                        message: "You already vote the candidate",
                    })
                }
            } else {
                return Result.Err({
                    code: 404,
                    message: "User not exits, please register or login the account first",
                })
            }
        } catch (err) {
            return Result.Err({
                code: 500,
                message: "Internal server error with message " + err
            });
        }
    }),

    getAllCandidate: query([], Result(Vec(Candidate), ErrorResponse), () => {
        try {
            return Result.Ok(candidateStore.values());
        } catch (err) {
            return Result.Err({
                code: 500,
                message: "Internal server error with message " + err
            });
        }
    })
});
