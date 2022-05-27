# Shoryuken

![Preview](preview.png)

Shoryuken is Trello-like web app created with NextJS and TailwindCSS. It has some features like:

- Authentication parts are like sign up, sign in, sign out, forgot password, and reset password.
- Create a board, open board detail, update board title, and delete a board.
- Create a list, update list title, and delete a list.
- Create a card, update card title and description, and delete a card.

## Installation

You need to follow these steps to install this project on your machine:

1. Clone the repo from GitHub.

```bash
git clone git@github.com:gattigaga/shoryuken.git
```

2. Open the directory and run `yarn` to install `node_modules`.

```bash
yarn
```

3. Sign in and create a project in [Supabase](https://supabase.com/).

4. Create `.env.local` in root directory and fill it with supabase url and anon key you got from this [page](https://app.supabase.io/project/YOUR_PROJECT_ID/settings/api) in Supabase.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

5. Run the project with `yarn`.

```bash
yarn dev
```
