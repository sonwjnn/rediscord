<h1 align="center">Rediscord</h1> <div align="center"> <strong>Rediscord is a real-time communication platform inspired by Discord</strong><br> Build a modern messaging app with channels, voice & video calls, and communities. </div> <br>

<br>

# About The Project

In the digital age, online communication has become an essential part of both personal and professional life. Platforms like Discord provide seamless real-time messaging, voice, and video interactions, helping users build and engage in various communities.

However, many existing solutions lack customization, control, and extensibility for businesses and individuals who want a private communication environment. Recognizing these needs, our team has developed Rediscord—a modern, feature-rich Discord alternative.

This project aims to deliver a real-time chat application that fosters efficient collaboration and interaction, integrating voice & video communication, channels, and private messaging for an enhanced user experience.

## Features

- 🔒 **Authentication:** Login, logout, OAuth with Google & GitHub.  
- 💬 **Real-time Messaging:** Send, edit, delete messages
- 🎙️ **Voice & Video Calls:** Join voice/video channels with Livekit support.  
- 📢 **Channels & Communities:** Create, manage, and customize chat channels.  
- 🔍 **User & Role Management:** Manage users, roles, and permissions for communities.  
- 📂 **File Sharing:** Upload and share images and documents.
- 🌐 **Deployment:** Deploy the website on Vercel. 

## Tech Stack
- **Back-end:** NextJS, Server Actions, TypeScript, PostgreSQL with Prisma ORM, .  
- **Front-end:** NextJS, ReactJS, TypeScript, TailwindCSS, ShadcnUI, AuthJS.  

## Cloning the repository

```sh
git clone https://github.com/sonwjnn/rediscord.git
```

## Install

```sh
bun install
# or
npm install
```

## Setup .env file

```sh
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=

LIVEKIT_API_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_SERVER_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

```

## Usage

```sh
# Run project
bun dev
```
