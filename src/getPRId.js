import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const query = `
        query($name: String!, $owner: String!, $issue: Int!) {
            repository(name: $name, owner: $owner) {
                pullRequest(number: $issue) {
                    id,
                    author {
                        login
                    }
                }
            }
        }
`

const getPRId = async function(token) {
    const octokit = getOctokit(token);

    const data = await octokit.graphql(query, {
        name: context.repo.repo,
        owner: context.repo.owner,
        issue: context.issue.number,
    });

    const prId = data?.repository?.pullRequest?.id;

    if (!prId) {
        core.setFailed('failed to get info from PR');
        process.exit(1);
    }

    return prId
}

export { getPRId }
