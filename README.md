# Cozy Groups - clone of Google Class app

## Developed by:
1. [Daniil Volosyuk](https://github.com/danyavol) - PM, Backend dev (Node.js, Express, MongoDB)
2. [Danil Sahuta](https://github.com/Gufaka37) - Frontend dev (React, Semantic UI)
3. [Roman Sukach](https://github.com/RomaTocks) - Frontend dev (React, Semantic UI)

## Functionality:
- **Registration** and **Authorization**
- **Authentication** is based on simple **access tokens** that will expire after 24h
- Ability to create **private groups**
- You can join a group **by invite code** (that can also be updated)
- **System of roles** within the group. There are 4 possible roles: **owner, admin, editor, member**
- Ability to create **posts**. Any member of the group can comment on posts
- There are 2 types of posts: **default** and **quiz**
- Quiz has very flexible settings. You can choose from 3 possible types of quiz:
**multiple vote**, **single vote** and **each quiz option is for one person only**. Also you can toggle the ability to cancel vote

## Group roles permissions:
### > Member
- Each person gets this role after joining the group
- Can see all posts
- Can comment posts
- Can vote in quizzes
### > Editor
- Has all previous permissions
- Can create posts and quizzes
### > Admin
- Has all previous permissions
- Can promote or demote *Members* and *Editors*, but not above the role of *Editor*
- Can kick *Members* and *Editors* from the group
- Can edit group information
- Can update invite code
### > Owner
- Has all previous permissions
- This role is assigned to the person who creates the group
- Can transfer *Owner* role to another person. After transferring the role he becomes an *Admin*
- *Owner* cannot leave the group until he transfer his role to another person
- *Owner* can delete the group
- Can promote and demote anyone
- Can kick from the group anyone


