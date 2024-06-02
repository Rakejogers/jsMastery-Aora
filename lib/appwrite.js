import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config ={
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jake.aora',
    projectId: '6653b38700052c6218a7',
    databaseId: '6653b4aa000db9b447ba',
    userCollectionId: '6653b4c100087d8a86dd',
    videoCollectionId: '6653b4d400307cedfc80',
    storageId: '6653b5d10017dea22f0c',
    likesCollectionId: '665ab99e001a029346c3'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
    likesCollectionId
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
const storage = new Storage(client);

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
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
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
            [Query.orderDesc('$createdAt'), Query.limit(3)]
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
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video'){
            fileUrl = storage.getFileView(storageId, fileId)
        } else if(type === 'image'){
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error('no fileUrl');

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    // const { mimeType, ...rest } = file;
    // const asset = { type: mimeType, ...rest };
    const { fileName, type: mimeType, fileSize, uri } = file;
    const fileData = {
        name: fileName,
        type: mimeType,
        size: fileSize,
        uri: uri,
    };


    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            fileData
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                prompt: form.prompt,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                creator: form.userId,
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLiked = async (userId) => {
    try {
        const likedPosts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('likedIds', [userId]), Query.orderDesc('$createdAt')]
        )
        return likedPosts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const likeVideo = async (userId, videoId, like) => {
    try {

        // Fetch the current document
        const currentDoc = await databases.getDocument(
            databaseId,
            videoCollectionId,
            videoId
        );

        const likedArray = currentDoc.likedIds
        

        if(like){
            likedArray.push(userId)
        } else {
            likedArray.pop(userId)
        }

        await databases.updateDocument(
            databaseId,
            videoCollectionId,
            videoId,
            {
                likedIds: likedArray
            }
        )

    } catch (error) {
        throw new Error(error);
    }
}

