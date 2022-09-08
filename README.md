# Github ref branch selector

This is a simple git action that allows the parsing and transformation of the github.ref variable and exposes it so other decisions can be performed uniformly in the actions pipeline.

1) Tags eg: `refs/tags/bv.2022-09-08.dev.01` will be parsed acording to `tags_format_regex` and the value will be mapped to the key in `tags_branch_map` or it will throw an error and stop the flow. The output is stored in `branch_name`. See the usage example below.

2) Branch commits eg: `refs/heads/develop` are parsed normally and the output of `branch_name` will be `develop` in this case

```
- uses: MihaiStrejer/GithubActionRefParser@v0.0.2
  id: ref-selector
  with:
      tags_format_regex: '(?<=[0-9]+\.)[a-zA-Z]+(?=\.*[0-9]+)'
      tags_branch_map: 'develop=dev,devdeploy;testing=test'
```

Then when you need it you can use it like this

```
- name: My conditional action
  if: ${{ steps.ref-selector.outputs.branch_name == 'develop' }}
```