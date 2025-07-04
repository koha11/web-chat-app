import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    fullname: String!
    avatar: String
    isOnline: Boolean
    lastLogined: String

    createdAt: String
    updatedAt: String
    deleted: Boolean
    deletedAt: String
  }

  extend type Query {
    users(userId: ID): [User!]!
  }

  extend type Mutation {
    postUser(userId: ID): User
  }
`;
