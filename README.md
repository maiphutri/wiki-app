# Blocipedia-node

Blocipedia is a CRUD web application built with NodeJS that allows authenticated users to create public and private markdown-based wikis based on their user role (standard or premium) and collaboration status. Check it out by visit at [blocipedia-heroku](https://maiphutri-blocipedia.herokuapp.com)

### Sign up, sign in, sign out
Blocipedia uses the [Passport](https://passportjs.org) to handle user authentication. When users sign up, they'll choose a email and password. Once signed up and log in, users will have full access to their own wikis as well as all public wikis. When signed out, users will only be able to view the homepage. To read or update an existing wiki, or to create a new wiki, a user must be signed in.

### Standard users and public wikis
All users begin as standard users by default, which gives them access to all public wikis. Standard users can create as many public wikis as they want, and all other Blocipedia users will be able to read and update all public wikis. Each public wiki will show the user who created it.

### Premium users and private wikis
Blocipedia uses [Stripe](https://stripe.com) integration to give users the option to pay a one-time $14.99 fee for an upgrade to a premium membership, which gives them the ability to create private wikis in addition to public wikis. Private wikis can only be read or updated by the creator of the wiki or other premium users whom the creator has designated as collaborators. Each private wiki will show the user who created it as well as all added collaborators.

### Collaborators
Creators of private wikis can add or remove collaborators to their wikis as they please, and those collaborators will have the ability to read and update the private wiki. Standard users can be added as collaborators to private wikis.

### Administrators
Admin users have all the same privileges as standard and premium users with the additional ability to delete wikis. This gives admin users the full CRUD capabilities of creating, reading, updating and deleting all wikis, public or private. Administrators can also add or remove collaborators on private wikis. Only the Blocipedia developer can add administrators.

### Markdown
Blocipedia uses the [markdown](https://www.npmjs.com/package/markdown) to parse Markdown syntax. This gives users the ability to format their wikis with headers, font styles, links, code and more.
___
This project was built for Bloc's Web Development Program.
