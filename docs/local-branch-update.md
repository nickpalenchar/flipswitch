# Updating default branch names in a local repository

After flipswitch changes a default name in a github repository, any local repos tracking it will need to be updated manually.

You can update your default branch locally with the following steps:

```shell
$ git checkout master
$ git branch -m master main
$ git fetch
$ git branch --unset-upstream
$ git branch -u origin/main
$ git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
```

Thanks to [This article](https://www.hanselman.com/blog/EasilyRenameYourGitDefaultBranchFromMasterToMain.aspx) for the inspiration!