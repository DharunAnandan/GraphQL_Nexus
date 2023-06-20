const { PrismaClient } = require('@prisma/client');
const { queryType,objectType,makeSchema,stringArg,mutationType } = require('@nexus/schema');
const { ApolloServer } = require('apollo-server');

const prisma = new PrismaClient();

const User = objectType({
  name: 'user',
  definition(t) {
    t.int('id');
    t.string('email');
    t.string('name');
  }
});

const Query = queryType({
  definition(t) {


    t.list.field('allUsers', {
      type: 'user',

      resolve: () => prisma.User.findMany({
        orderBy: {
          id: 'asc',
        }
      })
    });


    t.list.field('uniqueUser', {
      type: 'user',

      resolve: (_, args) => {
        prisma.User.findUnique({
          where: {
            email: args.email,
          }
        })
      },
    });
  }
});


const Mutation = mutationType({
    definition(t){


        t.field('createUser',{
            type: 'user',
            args:{
                name:stringArg({required: true}),
                email: stringArg({required: true}),
            },

            resolve: (_, args) => {
                const newUser = prisma.User.create({
                    data:{
                        name: args.name,
                        email: args.email,
                    },
                });
                return newUser;
            },
        });


        t.field('updateUser', {
          type: 'user',
          args:{
            name: stringArg({required: true}),
            email: stringArg({required: true}),
          },

          resolve: (_, args) => {
            const updatedUser = prisma.User.update({
              where: {
                id: 7,
              },
              data:{
                name: args.name,
                email: args.email,
              },
            });
            return updatedUser;
          },
        });


        t.field('deleteUser', {
          type: 'user',
      
          resolve: () => {
            const deletedUser = prisma.User.delete({
              where: {
                id: 3,
              },
            });
            return deletedUser;
          }
        })
    },
});

const schema = makeSchema({
  types: [User, Query, Mutation]
});

const server = new ApolloServer({ schema });
server.listen(4000, () => {
    console.log("running");
});