# Obtain target config by env variable and resolve its data

```javascript
const opts = {
  mode: SYNC,
    data: {
      data: {
        data: {
          target: "$env:BAZ"
        },
        template: "<root>/packages/uniconfig-core/test/stub/{{=it.target}}.json"
      },
      sources: {
        env: {
          pipeline: "env"
        }
      },
    },
    pipeline: 'datatree>dot>path>file>json>datatree'
  }

const config = new Config(opts)
```
