const { PrismaClient } = require('@prisma/client');
const { queryType,objectType,makeSchema,stringArg,mutationType, intArg } = require('@nexus/schema');
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


    t.field('uniqueUser', {
      type: 'user',
      args: {
        id:intArg({required:true})
      },
      resolve: (_, args) =>
        prisma.user.findUnique({
          where: {
            id: args.id, // Provide the desired ID here
          },
        }),
        
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
            id: intArg({required: true}),
            name: stringArg({required: true}),
            email: stringArg({required: true}),
          },

          resolve: (_, args) => {
            const updatedUser = prisma.User.update({
              where: {
                id: args.id,
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

//npx prisma migrate dev and npm start