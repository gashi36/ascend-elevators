import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://localhost:5001/graphql",
  documents: ["src/graphql/operations/**/*.gql"],
  generates: {
    "src/graphql/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-apollo-angular"
      ],
      config: {
        addExplicitOverride: true
      }
    }
  }
};

export default config;
