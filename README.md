# flipswitch - update the default branch of any and all of your repos.

## Install

```
npm install -g flipswitch
```

## Running

flipswitch is an interactive cli; no command line arguments are currently supported. Simply run

```
flipswitch
```

And follow the prompts.

## Requirements

You will need to [create a personal access token](https://github.com/settings/tokens/new) with at least the **public_repo** scope.

It is recommended to create with the **repos** scope. If you only select **public_repo**, you'll be able to update a single repository and will have to enter the URL of that repository to change. You will not be able to do any bulk updates, _including public repos_.

## Regarding storing access tokens.

When you store an access token in flipswitch, it is stored on your computer at `$HOME/.flipswitch` (aka `~/.flipswitch`)

It is recommended you delete the access token from your [personal access tokens](https://github.com/settings/tokens) when you are done.

## Updating default branches locally

See the markdown file in `docs/` for how to do this. It is required after using flipswitch on a repo if you cloned it earlier.

# Credits

Thanks to [This article](https://www.hanselman.com/blog/EasilyRenameYourGitDefaultBranchFromMasterToMain.aspx) for the inspiration!