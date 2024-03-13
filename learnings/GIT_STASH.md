## GIT STASH

### git stash

for stashing current works

#### git stash -u

for stashing untracked files

#### git stash -a

for stashing all files including those in `.gitignore`

#### git stash list

for listing all stashes

format:

```sh
$ git stash list
stash@{0}: WIP on main: 5002d47 our new homepage
stash@{1}: WIP on main: 5002d47 our new homepage
stash@{2}: WIP on main: 5002d47 our new homepage
```

#### git stash save "message here"

to save stashes with a message for a11y

format:

```sh
$ git stash save "add style to our site"
Saved working directory and index state On main: add style to our site
HEAD is now at 5002d47 our new homepage

$ git stash list
stash@{0}: On main: add style to our site
stash@{1}: WIP on main: 5002d47 our new homepage
stash@{2}: WIP on main: 5002d47 our new homepage
```

#### git stash pop

to append last popped changes

#### git stash pop stash${n}

to append nth popped changes

#### git stash show

to show all changes that was done for last stash

#### git stash show -p

to show all changes that was done for all stashes saved

format:

```sh
$ git stash show -p
diff --git a/style.css b/style.css
new file mode 100644
index 0000000..d92368b
--- /dev/null
+++ b/style.css
@@ -0,0 +1,3 @@
+* {
+  text-decoration: blink;
+}
diff --git a/index.html b/index.html
index 9daeafb..ebdcbd2 100644
--- a/index.html
+++ b/index.html
@@ -1 +1,2 @@
+<link rel="stylesheet" href="style.css"/>
```

#### git stash branch add-stylesheet stash@{1}

to create a new branch from our second stash

#### git stash drop stash@{1}

remove second last stash

#### git stash clear

remove all stashes without applying
