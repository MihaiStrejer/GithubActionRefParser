import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run() {

    const tagsRegex = core.getInput('tags_format_regex', { required: false });
    const tagsBranchMap = core.getInput('tags_branch_map', { required: false });

    try {
        const githubRef = github.context.ref;
        let branchName = '';

        // Handle tag scenario
        if (githubRef.startsWith('refs/tags/')) {
            const tag = githubRef.replace('refs/tags/', '');
            var keyValue = tag.match(tagsRegex);

            if (keyValue === null)
                throw new Error('Could not parse tag using the provided regex');

            const tagKey = keyValue[0];
            core.debug(`found tag: ${tag}, found key ${tagKey}`);

            const branchMapsItems = tagsBranchMap.split(';');
            const branchMap = branchMapsItems.reduce((a, c) => {
                const branchItem = c.split('=');
                const branchKey = branchItem[0];
                const branchVals = branchItem[1].split(',');

                branchVals.forEach(v => {
                    a[v] = branchKey;
                });

                return a;
            }, {} as { [key: string]: string })

            core.debug(`branch tags key map: ${JSON.stringify(branchMap)}`);
            
            var key = branchMap[tagKey];
            if(!key)
                throw new Error(`Key ${key} was not present in the tags_branch_map`);

            core.debug(`matched tag to map key: ${key}`);
            branchName = key;
        }

        // Handle head scenario (eg: workflow_dispatch)
        if (githubRef.startsWith('refs/heads/')) {
            branchName = githubRef.replace('refs/heads/', '');

            core.debug(`matched branch name from head ${branchName}`);
        }

        core.setOutput('branch_name', branchName)
    } catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message)
    }
}

run();