import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config ={
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jake.aora',
    projectId: '6653b38700052c6218a7',
    databaseId: '6653b4aa000db9b447ba',
    userCollectionId: '6653b4c100087d8a86dd',
    videoCollectionId: '6653b4d400307cedfc80',
    storageId: '6653b5d10017dea22f0c',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) throw new Error('Account creation failed');

        const avatarUrl = avatars.getInitials(username);

        const session = await account.createEmailPasswordSession(email, password);
        if (!session) throw new Error('Session creation failed');

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            },
            [], // read permissions
            [`user:${newAccount.$id}`] // write permissions


        );

        return newUser;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

//export const createUser = async (email, password, username) => {
//
//    // Register User
//    try {
//        const newAccount = await account.create(
//            ID.unique(),
//            email,
//            password,
//            username
//        )
//
//        if(!newAccount) throw Error;
//
//        const avatarURL = avatars.getInitials(username)
//
//        await signIn(email, password);
//
//        const newUser = await databases.createDocument(
//            config.databaseId,
//            config.userCollectionId,
//            ID.unique(),
//            {
//                accountId: newAccount.$id,
//                email,
//                username,
//                avatar: avatarURL
//            }
//        )
//        
//        return newUser;
//    } catch (error) {
//        console.log(error);
//        throw new Error(error);
//    }
//}


export const signIn = async (email, password) => {
   try {
       const session = await account.createEmailPasswordSession(
           email,
           password
       )
       const user = await account.get()

       return user;
   } catch (error) {
       throw new Error(error);
   }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error("No current account");

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error("No user found for current account");

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        //const user = await account.get()
        //console.log(user)
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}