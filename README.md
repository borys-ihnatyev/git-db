# Project Setup

This project uses:

- Node.js `22.16.0` (defined in `.nvmrc`)
- `pnpm` package manager `10.11.0`

## Prerequisites

- **[NVM](https://github.com/nvm-sh/nvm)**: Node Version Manager
- **[PNPM](https://pnpm.io/installation)**: Fast, disk space efficient package manager

---

## 1. Install Node.js using `.nvmrc`

Make sure `nvm` is installed:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then restart your terminal or reload your shell configuration:

```bash
source ~/.nvm/nvm.sh
```

Now install the correct Node.js version from `.nvmrc`:

```bash
nvm install
nvm use
```

> This will install and use Node.js `22.16.0` as defined in the `.nvmrc` file.

---

## 2. Install `pnpm` version 10.11.0

Enable and install the correct version of `pnpm` using `corepack`:

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

Verify the version:

```bash
pnpm -v
# Expected output: 10.11.0
```

---

## 3. Install project dependencies

After setting up Node.js and `pnpm`, install dependencies:

```bash
pnpm install
```

---

## 4. Bootstrap the database

```bash
pnpm bootstrap
```

this will scaffold file database with version control in the `api/db` directory (it is gitignored and not a submodule)

You're now ready to start working on the project 🚀

# Develop

```bash
pnpm dev
```

This will launch **api** and **web** packages in dev mode

## Editor setup

**VS Code**:

To work with comfortable and without typescript errors, open the project via `git-db.code-workspace` file.

And install recommended extensions.
