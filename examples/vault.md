# vault-kubernetes secrets obtain example

```json
{
  "data": {
    "secret": "$vault:data"
  },
  "sources": {
    "vault": {
      "data": {
        "data": {
          "method": "GET",
          "url": "$url:",
          "opts": {
            "headers": {
              "X-Vault-Token": "$token:auth.client_token"
            }
          }
        },
        "sources": {
          "url": {
            "data": {
              "data": {
                "data": {
                  "name": "$pkg:name",
                  "space": "openapi",
                  "env": "$env:ENVIRONMENT_PROFILE_NAME",
                  "vaultHost": "$env:VAULT_HOST",
                  "vaultPort": "$env:VAULT_PORT"
                },
                "template": "{{=it.env==='production' ? 'https': 'http'}}://{{=it.vaultHost}}:{{=it.vaultPort}}/v1/secret/applications/{{=it.space}}/{{=it.name}}"
              },
              "sources": {
                "env": {
                  "pipeline": "env"
                },
                "pkg": {
                  "pipeline": "pkg"
                }
              }
            },
            "pipeline": "datatree>dot"
          },
          "token": {
            "data": {
              "data": {
                "method": "POST",
                "url": "$url:",
                "opts": {
                  "json": {
                    "role": "$pkg:name",
                    "jwt": "$jwt:"
                  }
                }
              },
              "sources": {
                "pkg": {
                  "pipeline": "pkg"
                },
                "jwt": {
                  "data": {
                    "data": {
                      "data": {
                        "tokenPath": "$env:TOKEN_FILE",
                        "defaultTokenPath": "/var/run/secrets/kubernetes.io/serviceaccount/token"
                      },
                      "template": "{{=it.tokenPath || it.defaultTokenPath}}"
                    },
                    "sources": {
                      "env": {
                        "pipeline": "env"
                      }
                    }
                  },
                  "pipeline": "datatree>dot>file"
                },
                "url": {
                  "data": {
                    "data": {
                      "data": {
                        "env": "$env:ENVIRONMENT_PROFILE_NAME",
                        "vaultHost": "$env:VAULT_HOST",
                        "vaultPort": "$env:VAULT_PORT"
                      },
                      "template": "{{=it.env==='production' ? 'https': 'http'}}://{{=it.vaultHost}}:{{=it.vaultPort}}/v1/auth/kubernetes/login"
                    },
                    "sources": {
                      "env": {
                        "pipeline": "env"
                      },
                      "pkg": {
                        "pipeline": "pkg"
                      }
                    }
                  },
                  "pipeline": "datatree>dot"
                }
              }
            },
            "pipeline": "datatree>http>json"
          }
        }
      },
      "pipeline": "datatree>http>json"
    }
  }
}

```