import { currentUser } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import { FriendStatus } from "@prisma/client"

const prisma = new PrismaClient()

export const getOnlineFriendsByUserId = async (userId:string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Query for accepted friends who are online
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userOneId: userId, status: FriendStatus.ACCEPTED },
          { userTwoId: userId, status: FriendStatus.ACCEPTED }
        ],
        AND: [
          {
            OR: [
              {
                userOne: {
                  status: "ONLINE"
                }
              },
              {
                userTwo: {
                  status: "ONLINE"
                }
              }
            ]
          }
        ]
      },
      include: {
        userOne: true,
        userTwo: true
      }
    });

    // Return only online friends
    return friends.map(friend => {
      const isFriendUserOne = friend.userOneId === userId;
      const friendData = isFriendUserOne ? friend.userTwo : friend.userOne;
      
      return {
        id: friend.id,
        userId: friendData.id,
        name: friendData.name,
        image: friendData.image,
        status: friendData.status,
      };
    });
    
  } catch (error) {
    return []
  }
}

export const getAllFriendsByUserId = async (userId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }
    // Query for all accepted friends
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userOneId: userId, status: FriendStatus.ACCEPTED },
          { userTwoId: userId, status: FriendStatus.ACCEPTED }
        ]
      },
      include: {
        userOne: true,
        userTwo: true
      }
    });

    // Return all friends with their data

    return friends.map(friend => {
      const isFriendUserOne = friend.userOneId === userId;
      const friendData = isFriendUserOne ? friend.userTwo : friend.userOne;
      
      return {
        id: friend.id,
        userId: friendData.id,
        name: friendData.name,
        image: friendData.image,
        status: friendData.status,
      };
    });
    
  } catch (error) {
    console.log(error)

    return []
  }
}

export const getPendingRequestsByUserId = async (userId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('Unauthorized')
    }
    
    // Query for pending friend requests in both directions
    const incomingRequests = await prisma.friend.findMany({
      where: {
        userTwoId: userId,
        status: "PENDING"
      },
      include: {
        userOne: true
      }
    });

    const outgoingRequests = await prisma.friend.findMany({
      where: {
        userOneId: userId,
        status: "PENDING"
      },
      include: {
        userTwo: true
      }
    });

    // Format incoming requests (requests received)
    const formattedIncomingRequests = incomingRequests.map(request => ({
      id: request.id,
      userId: request.userOneId,
      name: request.userOne.name,
      image: request.userOne.image,
      status: null
    }));

    // Format outgoing requests (requests sent)
    const formattedOutgoingRequests = outgoingRequests.map(request => ({
      id: request.id,
      userId: request.userTwoId,
      name: request.userTwo.name,
      image: request.userTwo.image,
      status: null
    }));
    
    // Combine both types of requests
    return {
      incoming: formattedIncomingRequests,
      outgoing: formattedOutgoingRequests
    };
    
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return { incoming: [], outgoing: [] }
  }
}