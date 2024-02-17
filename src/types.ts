import { Principal, Record, bool, float32, nat, nat16, nat64, text } from "azle";

export const ErrorResponse = Record({
  code: nat16,
  message: text,
});

export const Candidate = Record({
  id: text,
  name: text,
  image: text,
  vote: nat,
})

export const CandidatePayload = Record({
  name: text,
  image: text
})

export const User = Record({
  id: Principal,
  name: text,
  email: text,
  address: text,
  birth: nat64,
  phone: text,
  role: text,
  isRegistered: bool,
  isChoose: bool,
  createdAt: nat64,
  updatedAt: nat64,
})

export const UserPayload = Record({
  name: text,
  email: text,
  address: text,
  birth: nat64,
  phone: text,
})

export type ErrorResponse = typeof ErrorResponse.tsType;
export type Candidate = typeof Candidate.tsType;
export type CandidatePayload = typeof CandidatePayload.tsType;
export type User = typeof User.tsType;
export type UserPayload = typeof UserPayload.tsType;